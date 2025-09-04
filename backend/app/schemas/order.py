# app/schemas/order.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from ..models.order import OrderStatus
from .product import ProductResponse

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductResponse
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    shipping_address: str
    payment_method_id: str  # Stripe payment method ID

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: OrderStatus
    shipping_address: str
    tracking_number: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    order_items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    tracking_number: Optional[str] = None

class OrderSummary(BaseModel):
    id: int
    total_amount: float
    status: OrderStatus
    created_at: datetime
    items_count: int