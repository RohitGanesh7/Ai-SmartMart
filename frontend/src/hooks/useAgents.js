import { useState, useEffect, useCallback } from 'react';
import { agentService } from '../services/agents';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useAgents = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user } = useAuth();

  // Load available agents on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadAvailableAgents();
      initializeWelcomeMessage();
    }
  }, [isAuthenticated]);

  // Auto-open chat for first-time visitors
  useEffect(() => {
    if (isAuthenticated) {
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      if (!hasVisited) {
        setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem('hasVisitedBefore', 'true');
        }, 3000); // Open after 3 seconds
      }
    }
  }, [isAuthenticated]);

  const loadAvailableAgents = async () => {
    try {
      const response = await agentService.getAvailableAgents();
      setAvailableAgents(response.agents);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setError('Failed to load AI assistants');
    }
  };

  const initializeWelcomeMessage = () => {
    if (conversation.length === 0 && user) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'agent',
        agentName: 'Emma - Sales Assistant',
        agentType: 'sales',
        content: `👋 Hi ${user.first_name || user.username}! Welcome to SmartShop! I'm Emma, your personal AI shopping assistant. I'm here to help you find the perfect products, answer questions, and make your shopping experience amazing. What can I help you with today?`,
        timestamp: new Date(),
        suggestedActions: [
          { text: 'Browse Products', action: 'browse_products' },
          { text: 'Current Deals', action: 'view_deals' },
          { text: 'Need Help?', action: 'get_help' },
          { text: 'Order Status', action: 'check_orders' }
        ]
      };
      
      setConversation([welcomeMessage]);
      setCurrentAgent({ 
        name: 'Emma - Sales Assistant', 
        type: 'sales',
        description: 'Your personal shopping guide'
      });
    }
  };

  const sendMessage = async (message, context = null) => {
    if (!message.trim() || loading) return;
    if (!isAuthenticated) {
      toast.error('Please login to chat with our AI assistants');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setTyping(true);

    try {
      // Enhanced context with user info
      const enhancedContext = {
        ...context,
        user_id: user?.id,
        user_name: user?.first_name || user?.username,
        user_email: user?.email,
        conversation_length: conversation.length
      };

      const response = await agentService.chatWithAgent(message, enhancedContext);
      
      // Add agent response to conversation
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        agentName: response.agent_name,
        agentType: response.agent_type,
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions || []
      };
      
      setConversation(prev => [...prev, agentMessage]);
      setCurrentAgent({ 
        name: response.agent_name, 
        type: response.agent_type,
        description: getAgentDescription(response.agent_type)
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to send message');
      
      // Add error message to conversation
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, errorMessage]);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const switchAgent = async (agentType) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await agentService.switchAgent(agentType);
      
      const agent = availableAgents.find(a => a.type === agentType);
      if (agent) {
        setCurrentAgent({ 
          name: agent.name, 
          type: agentType,
          description: agent.description
        });
        
        // Add system message about agent switch
        const switchMessage = {
          id: Date.now(),
          type: 'system',
          content: `Switched to ${agent.name}. How can I help you?`,
          timestamp: new Date(),
          suggestedActions: getAgentSuggestedActions(agentType)
        };
        
        setConversation(prev => [...prev, switchMessage]);
        toast.success(`Now chatting with ${agent.name}`);
      }
    } catch (error) {
      console.error('Agent switch error:', error);
      toast.error('Failed to switch agent');
    } finally {
      setLoading(false);
    }
  };

  const askAboutProduct = async (productId, question = "Tell me about this product") => {
    if (!isAuthenticated) {
      toast.error('Please login to get product information');
      return;
    }

    try {
      setLoading(true);
      setIsOpen(true); // Auto-open chat
      
      const response = await agentService.productInquiry(productId, question);
      
      const agentMessage = {
        id: Date.now(),
        type: 'agent',
        agentName: response.agent_name,
        agentType: response.agent_type,
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions || []
      };
      
      setConversation(prev => [...prev, agentMessage]);
      setCurrentAgent({ 
        name: response.agent_name, 
        type: response.agent_type,
        description: getAgentDescription(response.agent_type)
      });
      
    } catch (error) {
      console.error('Product inquiry error:', error);
      toast.error('Failed to get product information');
    } finally {
      setLoading(false);
    }
  };

  const checkOrderStatus = async (orderId) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setIsOpen(true); // Auto-open chat
      
      const response = await agentService.getOrderStatus(orderId);
      
      const agentMessage = {
        id: Date.now(),
        type: 'agent',
        agentName: response.agent_name,
        agentType: response.agent_type,
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions || []
      };
      
      setConversation(prev => [...prev, agentMessage]);
      setCurrentAgent({ 
        name: response.agent_name, 
        type: response.agent_type,
        description: getAgentDescription(response.agent_type)
      });
      
    } catch (error) {
      console.error('Order status error:', error);
      toast.error('Failed to get order status');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedAction = useCallback((action) => {
    const actionMessages = {
      'browse_products': 'Show me your latest products',
      'view_cart': 'I want to see my shopping cart',
      'view_deals': 'What deals and offers do you have?',
      'get_help': 'I need help with my account',
      'check_orders': 'Show me my recent orders',
      'view_product': 'Tell me more about this product',
      'compare_products': 'Help me compare similar products',
      'view_reviews': 'Show me customer reviews',
      'track_order': 'I want to track my order',
      'contact_support': 'I need to contact customer support'
    };
    
    const messageText = actionMessages[action] || `Help me with: ${action}`;
    sendMessage(messageText);
  }, [sendMessage]);

  const clearConversation = () => {
    setConversation([]);
    setCurrentAgent(null);
    setError(null);
    initializeWelcomeMessage();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Helper functions
  const getAgentDescription = (agentType) => {
    const descriptions = {
      'sales': 'Your personal shopping guide',
      'product_expert': 'Technical specialist and product advisor',
      'support': 'Customer service and order assistance'
    };
    return descriptions[agentType] || 'AI Assistant';
  };

  const getAgentSuggestedActions = (agentType) => {
    const actions = {
      'sales': [
        { text: 'Browse Products', action: 'browse_products' },
        { text: 'View Deals', action: 'view_deals' },
        { text: 'Recommendations', action: 'get_recommendations' }
      ],
      'product_expert': [
        { text: 'Compare Products', action: 'compare_products' },
        { text: 'Technical Details', action: 'view_specs' },
        { text: 'Compatibility', action: 'check_compatibility' }
      ],
      'support': [
        { text: 'Track Order', action: 'track_order' },
        { text: 'Order History', action: 'view_orders' },
        { text: 'Account Help', action: 'account_help' }
      ]
    };
    return actions[agentType] || [];
  };

  // Computed values
  const hasConversation = conversation.length > 0;
  const lastMessage = conversation[conversation.length - 1];
  const unreadCount = conversation.filter(msg => 
    msg.type === 'agent' && msg.timestamp > (lastMessage?.readAt || new Date(0))
  ).length;

  return {
    // State
    isOpen,
    currentAgent,
    conversation,
    availableAgents,
    loading,
    typing,
    error,
    
    // Actions
    sendMessage,
    switchAgent,
    askAboutProduct,
    checkOrderStatus,
    handleSuggestedAction,
    clearConversation,
    toggleChat,
    
    // Chat controls
    openChat: () => setIsOpen(true),
    closeChat: () => setIsOpen(false),
    
    // Computed values
    hasConversation,
    lastMessage,
    unreadCount,
    isProcessing: loading || typing,
    hasError: !!error,
    
    // Agent info
    currentAgentType: currentAgent?.type,
    currentAgentName: currentAgent?.name,
    isAgentAvailable: availableAgents.length > 0
  };
};