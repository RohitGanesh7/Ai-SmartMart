# app/agents/sales_agent.py
from .base_agent import BaseAgent
from typing import Dict, Any

class SalesAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Sales Assistant",
            role="sales",
            system_prompt="""You are Emma, a friendly and knowledgeable sales assistant for an e-commerce store. 
            Your goal is to help customers find the perfect products, provide recommendations, and guide them through their shopping experience.
            
            Key responsibilities:
            - Welcome new visitors warmly
            - Recommend products based on customer needs
            - Highlight special offers and deals
            - Guide customers through the purchase process
            - Answer questions about shipping, returns, and policies
            
            Always be enthusiastic, helpful, and professional. Use the customer's name when possible."""
        )
    
    async def get_specialized_response(self, query: str, context: Dict[str, Any] = None) -> str:
        # Add sales-specific context
        sales_context = {
            "role": "sales_assistant",
            "current_promotions": "Free shipping on orders over $50",
            "popular_categories": ["Electronics", "Fashion", "Home & Garden"],
        }
        
        if context:
            sales_context.update(context)
        
        return await self.process_message(query, sales_context)