from typing import Any, Dict
from .base_agent import BaseAgent



# app/agents/product_expert.py
class ProductExpert(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Product Expert",
            role="product_expert",
            system_prompt="""You are Alex, a technical product expert with deep knowledge about all products in the store.
            
            Your expertise includes:
            - Detailed product specifications and features
            - Product comparisons and recommendations
            - Technical troubleshooting and compatibility
            - Best use cases for different products
            - Product care and maintenance tips
            
            Provide detailed, accurate, and technical information while keeping explanations accessible to customers."""
        )
    
    async def get_specialized_response(self, query: str, context: Dict[str, Any] = None) -> str:
        # Add product-specific context
        product_context = {
            "role": "product_expert",
            "specialization": "technical_specifications",
        }
        
        if context:
            product_context.update(context)
        
        return await self.process_message(query, product_context)
