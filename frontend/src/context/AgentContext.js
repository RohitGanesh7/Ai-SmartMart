import React, { createContext, useContext, useState, useEffect } from 'react';
import { agentService } from '../services/agents';
import toast from 'react-hot-toast';

const AgentContext = createContext();

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};

export const AgentProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadAvailableAgents();
    // Auto-open chat for first-time visitors
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setTimeout(() => {
        setIsOpen(true);
        addWelcomeMessage();
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000);
    }
  }, []);

  // Update unread count when conversation changes and chat is closed
  useEffect(() => {
    if (!isOpen && conversation.length > 0) {
      const lastMessage = conversation[conversation.length - 1];
      if (lastMessage.type === 'agent' && !lastMessage.read) {
        setUnreadCount(prev => prev + 1);
      }
    } else if (isOpen) {
      // Mark all messages as read when chat is opened
      setUnreadCount(0);
      setConversation(prev => 
        prev.map(msg => ({ ...msg, read: true }))
      );
    }
  }, [conversation, isOpen]);

  const loadAvailableAgents = async () => {
    try {
      const response = await agentService.getAvailableAgents();
      setAvailableAgents(response.agents);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'agent',
      agentName: 'Sales Assistant',
      agentType: 'sales',
      content: "👋 Hi there! Welcome to our store! I'm Emma, your personal shopping assistant. I'm here to help you find the perfect products, answer any questions, and make your shopping experience amazing. What can I help you with today?",
      timestamp: new Date(),
      suggestedActions: [
        { text: 'Browse Products', action: 'browse_products' },
        { text: 'Current Deals', action: 'view_deals' },
        { text: 'Need Help?', action: 'get_help' }
      ],
      read: false
    };
    setConversation([welcomeMessage]);
    setCurrentAgent({ name: 'Sales Assistant', type: 'sales' });
  };

  const sendMessage = async (message, context = null) => {
    if (!message.trim()) return;

    setLoading(true);
    setIsTyping(true);
    
    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      read: true
    };
    
    setConversation(prev => [...prev, userMessage]);

    try {
      const response = await agentService.chatWithAgent(message, context);
      
      // Add agent response to conversation
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        agentName: response.agent_name,
        agentType: response.agent_type,
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions,
        read: isOpen // Mark as read if chat is open
      };
      
      setConversation(prev => [...prev, agentMessage]);
      setCurrentAgent({ name: response.agent_name, type: response.agent_type });
      
      // Show notification if chat is closed
      if (!isOpen) {
        toast.success(`${response.agent_name} sent you a message`, {
          onClick: () => setIsOpen(true)
        });
      }
      
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Chat error:', error);
      
      // Add error message to conversation
      const errorMessage = {
        id: Date.now() + 2,
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again or refresh the page.',
        timestamp: new Date(),
        read: true
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const switchAgent = async (agentType) => {
    try {
      await agentService.switchAgent(agentType);
      const agent = availableAgents.find(a => a.type === agentType);
      setCurrentAgent({ name: agent.name, type: agentType });
      
      // Add system message about agent switch
      const switchMessage = {
        id: Date.now(),
        type: 'system',
        content: `Switched to ${agent.name}. How can I help you?`,
        timestamp: new Date(),
        read: true
      };
      
      setConversation(prev => [...prev, switchMessage]);
      toast.success(`Switched to ${agent.name}`);
      
    } catch (error) {
      toast.error('Failed to switch agent');
      console.error('Agent switch error:', error);
    }
  };

  const askAboutProduct = async (productId, question = "Tell me about this product") => {
    try {
      setLoading(true);
      setIsTyping(true);
      
      // Add user question to conversation
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: question,
        timestamp: new Date(),
        read: true
      };
      
      setConversation(prev => [...prev, userMessage]);
      
      const response = await agentService.productInquiry(productId, question);
      
      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        agentName: response.agent_name,
        agentType: response.agent_type,
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions,
        read: isOpen
      };
      
      setConversation(prev => [...prev, agentMessage]);
      setCurrentAgent({ name: response.agent_name, type: response.agent_type });
      setIsOpen(true); // Open chat if not already open
      
    } catch (error) {
      toast.error('Failed to get product information');
      console.error('Product inquiry error:', error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const checkOrderStatus = async (orderId) => {
    try {
      setLoading(true);
      setIsTyping(true);
      
      const response = await agentService.getOrderStatus(orderId);
      
      const agentMessage = {
        id: Date.now(),
        type: 'agent',
        agentName: response.agent_name,
        agentType: response.agent_type,
        content: response.response,
        timestamp: new Date(),
        suggestedActions: response.suggested_actions,
        read: isOpen
      };
      
      setConversation(prev => [...prev, agentMessage]);
      setCurrentAgent({ name: response.agent_name, type: response.agent_type });
      setIsOpen(true);
      
    } catch (error) {
      toast.error('Failed to get order status');
      console.error('Order status error:', error);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    setCurrentAgent(null);
    setUnreadCount(0);
    toast.success('Conversation cleared');
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  const handleSuggestedAction = (action) => {
    const actionMessages = {
      'browse_products': 'Show me your products',
      'view_cart': 'I want to see my cart',
      'view_deals': 'What deals do you have?',
      'view_product': 'Tell me more about this product',
      'compare_products': 'Help me compare similar products',
      'view_reviews': 'Show me customer reviews',
      'track_order': 'I want to track my order',
      'view_orders': 'Show me my order history',
      'contact_support': 'I need help with my account',
      'get_help': 'I need assistance'
    };
    
    const messageText = actionMessages[action] || action;
    sendMessage(messageText);
  };

  const getAgentByType = (type) => {
    return availableAgents.find(agent => agent.type === type);
  };

  const isAgentAvailable = (type) => {
    return availableAgents.some(agent => agent.type === type);
  };

  const getConversationSummary = () => {
    const agentMessages = conversation.filter(msg => msg.type === 'agent').length;
    const userMessages = conversation.filter(msg => msg.type === 'user').length;
    
    return {
      totalMessages: conversation.length,
      agentMessages,
      userMessages,
      currentAgentType: currentAgent?.type,
      lastMessageTime: conversation.length > 0 ? conversation[conversation.length - 1].timestamp : null
    };
  };

  const value = {
    // State
    isOpen,
    currentAgent,
    conversation,
    availableAgents,
    loading,
    isTyping,
    unreadCount,
    
    // Actions
    sendMessage,
    switchAgent,
    askAboutProduct,
    checkOrderStatus,
    clearConversation,
    handleSuggestedAction,
    
    // Chat controls
    toggleChat,
    closeChat,
    openChat,
    setIsOpen,
    
    // Utilities
    getAgentByType,
    isAgentAvailable,
    getConversationSummary,
    
    // Computed values
    hasConversation: conversation.length > 0,
    lastMessage: conversation.length > 0 ? conversation[conversation.length - 1] : null
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};