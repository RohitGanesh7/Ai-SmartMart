from abc import ABC, abstractmethod
from typing import Dict, Any, List
import openai
from ..config import settings

openai.api_key = settings.openai_api_key

class BaseAgent(ABC):
    def __init__(self, name: str, role: str, system_prompt: str):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.conversation_history: List[Dict[str, str]] = []
    
    async def process_message(self, message: str, context: Dict[str, Any] = None) -> str:
        """Process user message and return response"""
        # Add user message to history
        self.conversation_history.append({"role": "user", "content": message})
        
        # Prepare context-aware prompt
        context_info = self._format_context(context) if context else ""
        enhanced_message = f"{context_info}\nUser: {message}"
        
        # Get AI response
        response = await self._get_ai_response(enhanced_message)
        
        # Add response to history
        self.conversation_history.append({"role": "assistant", "content": response})
        
        return response
    
    async def _get_ai_response(self, message: str) -> str:
        """Get response from OpenAI"""
        try:
            messages = [
                {"role": "system", "content": self.system_prompt},
                *self.conversation_history[-10:],  # Keep last 10 messages for context
                {"role": "user", "content": message}
            ]
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"I apologize, but I'm having trouble processing your request right now. Error: {str(e)}"
    
    def _format_context(self, context: Dict[str, Any]) -> str:
        """Format context information for the AI"""
        if not context:
            return ""
        
        context_str = "Context Information:\n"
        for key, value in context.items():
            context_str += f"- {key}: {value}\n"
        
        return context_str
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
    
    @abstractmethod
    async def get_specialized_response(self, query: str, context: Dict[str, Any] = None) -> str:
        """Override this method in specialized agents"""
        pass