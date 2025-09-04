from typing import Any, Dict
from .base_agent import BaseAgent


# app/agents/support_agent.py
class SupportAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Customer Support",
            role="support",
            system_prompt="""You are Sam, a customer support specialist focused on helping customers with orders, shipping, and account issues.
            
            Your responsibilities:
            - Order status and tracking information
            - Shipping and delivery questions
            - Return and refund processes
            - Account management assistance
            - Problem resolution and escalation
            
            Always be patient, empathetic, and solution-focused. Provide clear next steps and timelines when possible."""
        )
    
    async def get_specialized_response(self, query: str, context: Dict[str, Any] = None) -> str:
        # Add support-specific context
        support_context = {
            "role": "customer_support",
            "available_services": ["order_tracking", "returns", "account_help"],
            "business_hours": "9 AM - 6 PM EST, Monday-Friday",
        }
        
        if context:
            support_context.update(context)
        
        return await self.process_message(query, support_context)