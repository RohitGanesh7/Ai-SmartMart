import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  Users
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { useAuth } from '../../context/AuthContext';

const ChatWidget = () => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { 
    isOpen, 
    setIsOpen, 
    currentAgent, 
    conversation, 
    availableAgents,
    loading,
    sendMessage,
    switchAgent,
    clearConversation
  } = useAgent();
  
  const { isAuthenticated } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    
    await sendMessage(message);
    setMessage('');
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

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle size={24} />
          {conversation.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {conversation.filter(msg => msg.type === 'agent').length}
            </span>
          )}
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <div>
                <h3 className="font-medium">
                  {currentAgent?.name || 'AI Assistant'}
                </h3>
                <p className="text-xs opacity-90">
                  {currentAgent?.type === 'sales' && 'Sales & Recommendations'}
                  {currentAgent?.type === 'product_expert' && 'Product Specialist'}
                  {currentAgent?.type === 'support' && 'Customer Support'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-primary-700 rounded"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={clearConversation}
                className="p-1 hover:bg-primary-700 rounded"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-primary-700 rounded"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Agent Switcher */}
              <div className="p-2 border-b bg-gray-50">
                <div className="flex space-x-1">
                  {availableAgents.map((agent) => (
                    <button
                      key={agent.type}
                      onClick={() => switchAgent(agent.type)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        currentAgent?.type === agent.type
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {agent.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {conversation.map((msg) => (
                  <div key={msg.id}>
                    {msg.type === 'user' && (
                      <div className="flex justify-end">
                        <div className="bg-primary-600 text-white p-2 rounded-lg max-w-xs">
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    )}
                    
                    {(msg.type === 'agent' || msg.type === 'system') && (
                      <div className="flex justify-start">
                        <div className="space-y-2 max-w-xs">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            {msg.type === 'agent' && (
                              <div className="flex items-center space-x-1 mb-1">
                                <Bot size={12} />
                                <span className="text-xs font-medium text-gray-600">
                                  {msg.agentName}
                                </span>
                              </div>
                            )}
                            <p className="text-sm text-gray-800">{msg.content}</p>
                          </div>
                          
                          {/* Suggested Actions */}
                          {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                            <div className="space-y-1">
                              {msg.suggestedActions.map((action, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestedAction(action.action)}
                                  className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded border transition-colors"
                                >
                                  {action.text}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Bot size={12} />
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-600 text-sm"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;