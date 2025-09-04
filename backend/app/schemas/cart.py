# app/schemas/cart.py
from pydantic import BaseModel
from datetime import datetime
from .product import ProductResponse

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    created_at: datetime
    product: ProductResponse
    
    class Config:
        from_attributes = True

class CartSummary(BaseModel):
    total_items: int
    total_amount: float
    items: list[CartItemResponse]