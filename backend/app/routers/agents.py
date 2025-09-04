from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from pydantic import BaseModel
from ..database import get_db
from ..models.user import User
from ..models.product import Product
from ..models.order import Order
from ..utils.dependencies import get_current_active_user
from ..services.agent_service import AgentService

router = APIRouter(prefix="/agents", tags=["AI Agents"])

# Initialize agent service
agent_service = AgentService()

class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class AgentSwitch(BaseModel):
    agent_type: str

class ChatResponse(BaseModel):
    agent_name: str
    agent_type: str
    response: str
    suggested_actions: list

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Chat with AI agents"""
    user_id = str(current_user.id)
    
    # Enhance context with user information
    context = chat_message.context or {}
    context.update({
        "user_id": current_user.id,
        "user_name": current_user.first_name or current_user.username,
        "user_email": current_user.email
    })
    
    # Add recent order information if available
    recent_orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).limit(3).all()
    
    if recent_orders:
        context["recent_orders"] = [
            {
                "id": order.id,
                "status": order.status.value,
                "total": order.total_amount,
                "date": order.created_at.isoformat()
            }
            for order in recent_orders
        ]
    
    # Get response from agent service
    response = await agent_service.route_message(
        user_id=user_id,
        message=chat_message.message,
        context=context
    )
    
    return ChatResponse(**response)

@router.post("/switch-agent")
async def switch_agent(
    agent_switch: AgentSwitch,
    current_user: User = Depends(get_current_active_user)
):
    """Manually switch to a specific agent"""
    user_id = str(current_user.id)
    
    success = agent_service.switch_agent(user_id, agent_switch.agent_type)
    
    if not success:
        raise HTTPException(status_code=400, detail="Invalid agent type")
    
    return {
        "message": f"Switched to {agent_switch.agent_type} agent",
        "agent_type": agent_switch.agent_type
    }

@router.get("/available")
async def get_available_agents():
    """Get list of available agents"""
    return {
        "agents": agent_service.get_available_agents()
    }

@router.post("/product-inquiry/{product_id}")
async def product_inquiry(
    product_id: int,
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Ask about a specific product"""
    # Get product information
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create context with product information
    context = {
        "product_id": product.id,
        "product_name": product.name,
        "product_description": product.description,
        "product_price": product.price,
        "product_category": product.category,
        "product_stock": product.stock_quantity,
        "user_name": current_user.first_name or current_user.username
    }
    
    # Force switch to product expert for product inquiries
    user_id = str(current_user.id)
    agent_service.switch_agent(user_id, "product_expert")
    
    # Get response
    response = await agent_service.route_message(
        user_id=user_id,
        message=chat_message.message,
        context=context
    )
    
    return ChatResponse(**response)

@router.get("/order-status/{order_id}")
async def get_order_status_with_agent(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get order status through support agent"""
    # Get order information
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Create context with order information
    context = {
        "order_id": order.id,
        "order_status": order.status.value,
        "order_total": order.total_amount,
        "order_date": order.created_at.isoformat(),
        "tracking_number": order.tracking_number,
        "shipping_address": order.shipping_address,
        "user_name": current_user.first_name or current_user.username
    }
    
    # Force switch to support agent
    user_id = str(current_user.id)
    agent_service.switch_agent(user_id, "support")
    
    # Auto-generate status inquiry
    message = f"Can you give me an update on my order #{order_id}?"
    
    # Get response
    response = await agent_service.route_message(
        user_id=user_id,
        message=message,
        context=context
    )
    
    return ChatResponse(**response)