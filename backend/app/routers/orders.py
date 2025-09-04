from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import stripe
import secrets
from ..database import get_db
from ..models.user import User
from ..models.product import Product
from ..models.cart import CartItem
from ..models.order import Order, OrderItem, OrderStatus
from ..schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from ..utils.dependencies import get_current_active_user, get_current_user
from ..config import settings

# Initialize Stripe
stripe.api_key = settings.stripe_secret_key

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new order from cart items"""
    
    # Get cart items
    cart_items = db.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).all()
    
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )
    
    # Calculate total and validate stock
    total_amount = 0
    order_items_data = []
    
    for cart_item in cart_items:
        product = cart_item.product
        
        # Check if product is still active
        if not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product '{product.name}' is no longer available"
            )
        
        # Check stock availability
        if product.stock_quantity < cart_item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock_quantity} items of '{product.name}' available"
            )
        
        item_total = cart_item.quantity * product.price
        total_amount += item_total
        
        order_items_data.append({
            "product_id": product.id,
            "quantity": cart_item.quantity,
            "price": product.price
        })
    
    # Add tax (8%)
    tax_amount = total_amount * 0.08
    total_with_tax = total_amount + tax_amount
    
    try:
        # Create Stripe PaymentIntent
        payment_intent = stripe.PaymentIntent.create(
            amount=int(total_with_tax * 100),  # Stripe expects cents
            currency='usd',
            payment_method=order_data.payment_method_id,
            confirmation_method='manual',
            confirm=True,
            return_url='http://localhost:3000/orders',
            metadata={
                'user_id': current_user.id,
                'user_email': current_user.email
            }
        )
        
        # Handle payment confirmation
        if payment_intent.status == 'requires_action':
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail={
                    "requires_action": True,
                    "payment_intent": {
                        "id": payment_intent.id,
                        "client_secret": payment_intent.client_secret
                    }
                }
            )
        elif payment_intent.status != 'succeeded':
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Payment failed"
            )
        
        # Create order
        db_order = Order(
            user_id=current_user.id,
            total_amount=round(total_with_tax, 2),
            status=OrderStatus.CONFIRMED,
            shipping_address=order_data.shipping_address,
            stripe_payment_intent_id=payment_intent.id
        )
        
        db.add(db_order)
        db.flush()  # Get the order ID
        
        # Create order items and update stock
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data["product_id"],
                quantity=item_data["quantity"],
                price=item_data["price"]
            )
            db.add(order_item)
            
            # Update product stock
            product = db.query(Product).filter(Product.id == item_data["product_id"]).first()
            product.stock_quantity -= item_data["quantity"]
        
        # Clear cart
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        
        db.commit()
        db.refresh(db_order)
        
        return db_order
        
    except stripe.error.StripeError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Payment error: {str(e)}"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Order creation failed: {str(e)}"
        )

@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's order history"""
    
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get specific order details"""
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return order

@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update order status (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Update status
    order.status = status_update.status
    
    # Update tracking number if provided
    if status_update.tracking_number:
        order.tracking_number = status_update.tracking_number
    
    # Generate tracking number for shipped orders if not provided
    if status_update.status == OrderStatus.SHIPPED and not order.tracking_number:
        order.tracking_number = f"TRK{secrets.token_hex(8).upper()}"
    
    db.commit()
    db.refresh(order)
    
    return order

@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cancel an order"""
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Check if order can be cancelled
    if order.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel order with status: {order.status.value}"
        )
    
    try:
        # Refund payment if confirmed
        if order.status == OrderStatus.CONFIRMED and order.stripe_payment_intent_id:
            stripe.Refund.create(
                payment_intent=order.stripe_payment_intent_id,
                reason='requested_by_customer'
            )
        
        # Update order status
        order.status = OrderStatus.CANCELLED
        
        # Restore product stock
        for order_item in order.order_items:
            product = order_item.product
            product.stock_quantity += order_item.quantity
        
        db.commit()
        
        return {"message": "Order cancelled successfully"}
        
    except stripe.error.StripeError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Refund failed: {str(e)}"
        )

@router.get("/{order_id}/track")
async def track_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get order tracking information"""
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Create tracking timeline
    timeline = []
    
    if order.status in [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING, 
                       OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
        timeline.append({
            "status": "Order Placed",
            "date": order.created_at,
            "completed": True,
            "description": "Your order has been received and is being processed"
        })
    
    if order.status in [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, 
                       OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
        timeline.append({
            "status": "Payment Confirmed",
            "date": order.created_at,
            "completed": True,
            "description": "Payment has been processed successfully"
        })
    
    if order.status in [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
        timeline.append({
            "status": "Processing",
            "date": order.updated_at,
            "completed": True,
            "description": "Your order is being prepared for shipment"
        })
    
    if order.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED]:
        timeline.append({
            "status": "Shipped",
            "date": order.updated_at,
            "completed": True,
            "description": f"Your order has been shipped. Tracking: {order.tracking_number}"
        })
    
    if order.status == OrderStatus.DELIVERED:
        timeline.append({
            "status": "Delivered",
            "date": order.updated_at,
            "completed": True,
            "description": "Your order has been delivered successfully"
        })
    
    # Add next expected step
    if order.status == OrderStatus.CONFIRMED:
        timeline.append({
            "status": "Processing",
            "date": None,
            "completed": False,
            "description": "Your order will be processed within 1-2 business days"
        })
    elif order.status == OrderStatus.PROCESSING:
        timeline.append({
            "status": "Shipped",
            "date": None,
            "completed": False,
            "description": "Your order will be shipped within 2-3 business days"
        })
    elif order.status == OrderStatus.SHIPPED:
        timeline.append({
            "status": "Delivered",
            "date": None,
            "completed": False,
            "description": "Estimated delivery within 3-5 business days"
        })
    
    return {
        "order_id": order.id,
        "status": order.status.value,
        "tracking_number": order.tracking_number,
        "estimated_delivery": "3-5 business days" if order.status == OrderStatus.SHIPPED else None,
        "timeline": timeline
    }

@router.get("/admin/all", response_model=List[OrderResponse])
async def get_all_orders(
    skip: int = 0,
    limit: int = 50,
    status: Optional[OrderStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders (admin only)"""
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    query = db.query(Order)
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return orders