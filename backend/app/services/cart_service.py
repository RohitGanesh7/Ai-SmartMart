from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from ..models.cart import CartItem
from ..models.product import Product
from ..models.user import User
from ..schemas.cart import CartItemCreate, CartItemUpdate, CartItemResponse

class CartService:
    def __init__(self, db: Session):
        self.db = db

    async def get_user_cart(self, user_id: int) -> List[CartItem]:
        """Get all cart items for a user"""
        return self.db.query(CartItem).filter(
            CartItem.user_id == user_id
        ).join(Product).filter(Product.is_active == True).all()

    async def add_to_cart(self, user_id: int, cart_item_data: CartItemCreate) -> CartItem:
        """Add item to cart or update quantity if already exists"""
        # Check if product exists and is active
        product = self.db.query(Product).filter(
            Product.id == cart_item_data.product_id,
            Product.is_active == True
        ).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        # Check stock availability
        if product.stock_quantity < cart_item_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock_quantity} items available in stock"
            )
        
        # Check if item already exists in cart
        existing_item = self.db.query(CartItem).filter(
            CartItem.user_id == user_id,
            CartItem.product_id == cart_item_data.product_id
        ).first()
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + cart_item_data.quantity
            if product.stock_quantity < new_quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Only {product.stock_quantity} items available in stock"
                )
            
            existing_item.quantity = new_quantity
            self.db.commit()
            self.db.refresh(existing_item)
            return existing_item
        else:
            # Create new cart item
            cart_item = CartItem(
                user_id=user_id,
                product_id=cart_item_data.product_id,
                quantity=cart_item_data.quantity
            )
            self.db.add(cart_item)
            self.db.commit()
            self.db.refresh(cart_item)
            return cart_item

    async def update_cart_item(self, user_id: int, cart_item_id: int, 
                              cart_item_update: CartItemUpdate) -> Optional[CartItem]:
        """Update cart item quantity"""
        cart_item = self.db.query(CartItem).filter(
            CartItem.id == cart_item_id,
            CartItem.user_id == user_id
        ).first()
        
        if not cart_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cart item not found"
            )
        
        # Check stock availability
        product = self.db.query(Product).filter(Product.id == cart_item.product_id).first()
        if product.stock_quantity < cart_item_update.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock_quantity} items available in stock"
            )
        
        cart_item.quantity = cart_item_update.quantity
        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    async def remove_from_cart(self, user_id: int, cart_item_id: int) -> bool:
        """Remove item from cart"""
        cart_item = self.db.query(CartItem).filter(
            CartItem.id == cart_item_id,
            CartItem.user_id == user_id
        ).first()
        
        if not cart_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cart item not found"
            )
        
        self.db.delete(cart_item)
        self.db.commit()
        return True

    async def clear_cart(self, user_id: int) -> bool:
        """Clear all items from user's cart"""
        cart_items = self.db.query(CartItem).filter(CartItem.user_id == user_id).all()
        
        for item in cart_items:
            self.db.delete(item)
        
        self.db.commit()
        return True

    async def get_cart_total(self, user_id: int) -> float:
        """Calculate total price of all items in cart"""
        cart_items = await self.get_user_cart(user_id)
        total = 0.0
        
        for item in cart_items:
            total += item.product.price * item.quantity
        
        return total

    async def get_cart_item_count(self, user_id: int) -> int:
        """Get total number of items in cart"""
        cart_items = await self.get_user_cart(user_id)
        return sum(item.quantity for item in cart_items)

    async def validate_cart_items(self, user_id: int) -> List[dict]:
        """Validate all cart items for stock availability"""
        cart_items = await self.get_user_cart(user_id)
        validation_results = []
        
        for item in cart_items:
            is_valid = item.product.stock_quantity >= item.quantity
            validation_results.append({
                'cart_item_id': item.id,
                'product_id': item.product_id,
                'product_name': item.product.name,
                'requested_quantity': item.quantity,
                'available_quantity': item.product.stock_quantity,
                'is_valid': is_valid,
                'is_active': item.product.is_active
            })
        
        return validation_results

    async def get_cart_item_by_id(self, user_id: int, cart_item_id: int) -> Optional[CartItem]:
        """Get specific cart item by ID"""
        return self.db.query(CartItem).filter(
            CartItem.id == cart_item_id,
            CartItem.user_id == user_id
        ).first()

    async def merge_carts(self, source_user_id: int, target_user_id: int) -> bool:
        """Merge cart items from one user to another (useful for guest to user conversion)"""
        source_cart_items = await self.get_user_cart(source_user_id)
        
        for source_item in source_cart_items:
            # Check if target user already has this product in cart
            existing_item = self.db.query(CartItem).filter(
                CartItem.user_id == target_user_id,
                CartItem.product_id == source_item.product_id
            ).first()
            
            if existing_item:
                # Merge quantities
                existing_item.quantity += source_item.quantity
            else:
                # Create new cart item for target user
                new_item = CartItem(
                    user_id=target_user_id,
                    product_id=source_item.product_id,
                    quantity=source_item.quantity
                )
                self.db.add(new_item)
            
            # Remove from source cart
            self.db.delete(source_item)
        
        self.db.commit()
        return True