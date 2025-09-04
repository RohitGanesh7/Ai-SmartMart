from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
import stripe
from datetime import datetime
import secrets
from ..models.order import Order, OrderItem, OrderStatus
from ..models.cart import CartItem
from ..models.product import Product
from ..models.user import User
from ..schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from ..config import settings
from .cart_service import CartService
from .product_service import ProductService

# Configure Stripe
stripe.api_key = settings.stripe_secret_key

class OrderService:
    def __init__(self, db: Session):
        self.db = db
        self.cart_service = CartService(db)
        self.product_service = ProductService(db)

    async def create_order_from_cart(self, user_id: int, order_data: OrderCreate) -> Order:
        """Create order from user's cart items"""
        # Get cart items
        cart_items = await self.cart_service.get_user_cart(user_id)
        
        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cart is empty"
            )
        
        # Validate cart items and calculate total
        total_amount = 0.0
        order_items_data = []
        
        for cart_item in cart_items:
            product = cart_item.product
            
            # Check if product is still active and available
            if not product.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product '{product.name}' is no longer available"
                )
            
            # Check stock availability
            if product.stock_quantity < cart_item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Only {product.stock_quantity} units of '{product.name}' available"
                )
            
            item_total = product.price * cart_item.quantity
            total_amount += item_total
            
            order_items_data.append({
                'product_id': product.id,
                'quantity': cart_item.quantity,
                'price': product.price
            })
        
        # Create Stripe Payment Intent
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),  # Convert to cents
                currency='usd',
                payment_method=order_data.payment_method_id,
                confirmation_method='manual',
                confirm=True,
                metadata={
                    'user_id': user_id,
                    'order_type': 'ecommerce'
                }
            )
        except stripe.error.StripeError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment processing failed: {str(e)}"
            )
        
        # Create order
        db_order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status=OrderStatus.PENDING,
            stripe_payment_intent_id=payment_intent.id,
            shipping_address=order_data.shipping_address
        )
        
        self.db.add(db_order)
        self.db.commit()
        self.db.refresh(db_order)
        
        # Create order items and update stock
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_data['price']
            )
            self.db.add(order_item)
            
            # Update product stock
            await self.product_service.update_stock(
                item_data['product_id'], 
                -item_data['quantity']
            )
        
        # Clear cart after successful order creation
        await self.cart_service.clear_cart(user_id)
        
        # Update order status based on payment
        if payment_intent.status == 'succeeded':
            db_order.status = OrderStatus.CONFIRMED
        
        self.db.commit()
        self.db.refresh(db_order)
        
        return db_order

    async def get_user_orders(self, user_id: int, skip: int = 0, limit: int = 10) -> List[Order]:
        """Get all orders for a user"""
        return self.db.query(Order).filter(
            Order.user_id == user_id
        ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

    async def get_order_by_id(self, order_id: int, user_id: Optional[int] = None) -> Optional[Order]:
        """Get order by ID, optionally filtered by user"""
        query = self.db.query(Order).filter(Order.id == order_id)
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        return query.first()

    async def update_order_status(self, order_id: int, status_update: OrderStatusUpdate) -> Optional[Order]:
        """Update order status (admin function)"""
        order = self.db.query(Order).filter(Order.id == order_id).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        order.status = status_update.status
        
        if status_update.tracking_number:
            order.tracking_number = status_update.tracking_number
        
        # Auto-generate tracking number for shipped orders
        if status_update.status == OrderStatus.SHIPPED and not order.tracking_number:
            order.tracking_number = self._generate_tracking_number()
        
        self.db.commit()
        self.db.refresh(order)
        
        return order

    async def cancel_order(self, order_id: int, user_id: int) -> bool:
        """Cancel an order and restore stock"""
        order = self.db.query(Order).filter(
            Order.id == order_id,
            Order.user_id == user_id
        ).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Only allow cancellation for certain statuses
        if order.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot cancel order that has been shipped or delivered"
            )
        
        # Restore stock for all order items
        for order_item in order.order_items:
            await self.product_service.update_stock(
                order_item.product_id,
                order_item.quantity  # Add back to stock
            )
        
        # Cancel Stripe payment if possible
        if order.stripe_payment_intent_id:
            try:
                stripe.PaymentIntent.cancel(order.stripe_payment_intent_id)
            except stripe.error.StripeError:
                pass  # Payment might already be processed
        
        order.status = OrderStatus.CANCELLED
        self.db.commit()
        
        return True

    async def get_order_statistics(self, user_id: Optional[int] = None) -> dict:
        """Get order statistics"""
        query = self.db.query(Order)
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        orders = query.all()
        
        stats = {
            'total_orders': len(orders),
            'total_revenue': sum(order.total_amount for order in orders),
            'status_breakdown': {}
        }
        
        # Count orders by status
        for status in OrderStatus:
            count = len([o for o in orders if o.status == status])
            stats['status_breakdown'][status.value] = count
        
        return stats

    async def search_orders(self, user_id: Optional[int] = None, 
                           status: Optional[OrderStatus] = None,
                           start_date: Optional[datetime] = None,
                           end_date: Optional[datetime] = None) -> List[Order]:
        """Search orders with filters"""
        query = self.db.query(Order)
        
        if user_id:
            query = query.filter(Order.user_id == user_id)
        
        if status:
            query = query.filter(Order.status == status)
        
        if start_date:
            query = query.filter(Order.created_at >= start_date)
        
        if end_date:
            query = query.filter(Order.created_at <= end_date)
        
        return query.order_by(Order.created_at.desc()).all()

    async def process_refund(self, order_id: int) -> bool:
        """Process refund for an order"""
        order = self.db.query(Order).filter(Order.id == order_id).first()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        if not order.stripe_payment_intent_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No payment to refund"
            )
        
        try:
            # Create refund in Stripe
            refund = stripe.Refund.create(
                payment_intent=order.stripe_payment_intent_id,
                reason='requested_by_customer'
            )
            
            # Restore stock
            for order_item in order.order_items:
                await self.product_service.update_stock(
                    order_item.product_id,
                    order_item.quantity
                )
            
            order.status = OrderStatus.CANCELLED
            self.db.commit()
            
            return True
        
        except stripe.error.StripeError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Refund processing failed: {str(e)}"
            )

    def _generate_tracking_number(self) -> str:
        """Generate a random tracking number"""
        return f"TR{secrets.token_hex(8).upper()}"

    async def get_recent_orders(self, limit: int = 5) -> List[Order]:
        """Get recent orders (admin function)"""
        return self.db.query(Order).order_by(
            Order.created_at.desc()
        ).limit(limit).all()