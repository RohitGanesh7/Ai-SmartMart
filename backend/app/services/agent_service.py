from typing import Dict, Any, Optional
from ..agents.sales_agent import SalesAgent
from ..agents.product_expert import ProductExpert
from ..agents.support_agent import SupportAgent

class AgentService:
    def __init__(self):
        self.agents = {
            "sales": SalesAgent(),
            "product_expert": ProductExpert(),
            "support": SupportAgent()
        }
        self.user_sessions: Dict[str, str] = {}  # user_id -> agent_type
    
    async def route_message(self, user_id: str, message: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Route message to appropriate agent or determine best agent"""
        
        # Determine which agent to use
        agent_type = await self._determine_agent(message, context)
        
        # Get or create user session
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = agent_type
        
        current_agent_type = self.user_sessions[user_id]
        
        # Check if we need to switch agents
        if agent_type != current_agent_type and agent_type != "continue":
            self.user_sessions[user_id] = agent_type
            current_agent_type = agent_type
        
        # Get response from appropriate agent
        agent = self.agents[current_agent_type]
        response = await agent.get_specialized_response(message, context)
        
        return {
            "agent_name": agent.name,
            "agent_type": current_agent_type,
            "response": response,
            "suggested_actions": await self._get_suggested_actions(current_agent_type, message)
        }
    
    async def _determine_agent(self, message: str, context: Dict[str, Any] = None) -> str:
        """Determine which agent should handle the message"""
        message_lower = message.lower()
        
        # Keywords for different agents
        sales_keywords = ["buy", "purchase", "recommend", "suggest", "deal", "offer", "price", "discount", "hello", "hi", "welcome"]
        product_keywords = ["spec", "specification", "feature", "compare", "technical", "detail", "how does", "what is"]
        support_keywords = ["order", "shipping", "track", "return", "refund", "problem", "issue", "help", "account", "delivery"]
        
        # Check for keywords
        if any(keyword in message_lower for keyword in support_keywords):
            return "support"
        elif any(keyword in message_lower for keyword in product_keywords):
            return "product_expert"
        elif any(keyword in message_lower for keyword in sales_keywords):
            return "sales"
        
        # Default to sales for general inquiries
        return "sales"
    
    async def _get_suggested_actions(self, agent_type: str, message: str) -> list:
        """Get suggested actions based on agent type and message"""
        if agent_type == "sales":
            return [
                {"text": "View Products", "action": "browse_products"},
                {"text": "View Cart", "action": "view_cart"},
                {"text": "Current Deals", "action": "view_deals"}
            ]
        elif agent_type == "product_expert":
            return [
                {"text": "Product Details", "action": "view_product"},
                {"text": "Compare Products", "action": "compare_products"},
                {"text": "Read Reviews", "action": "view_reviews"}
            ]
        elif agent_type == "support":
            return [
                {"text": "Track Order", "action": "track_order"},
                {"text": "Order History", "action": "view_orders"},
                {"text": "Contact Support", "action": "contact_support"}
            ]
        
        return []
    
    def switch_agent(self, user_id: str, agent_type: str) -> bool:
        """Manually switch to a specific agent"""
        if agent_type in self.agents:
            self.user_sessions[user_id] = agent_type
            return True
        return False
    
    def get_available_agents(self) -> list:
        """Get list of available agents"""
        return [
            {
                "type": "sales",
                "name": "Sales Assistant",
                "description": "Help with product recommendations and purchases"
            },
            {
                "type": "product_expert",
                "name": "Product Expert",
                "description": "Technical details and product comparisons"
            },
            {
                "type": "support",
                "name": "Customer Support",
                "description": "Order tracking and account assistance"
            }
        ]