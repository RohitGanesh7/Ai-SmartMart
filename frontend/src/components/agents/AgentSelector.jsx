import React from 'react';
import { useAgent } from '../../context/AgentContext';
import { ShoppingBag, Star, Headphones, Bot, Check } from 'lucide-react';

const AgentSelector = ({ isOpen, onClose }) => {
  const { availableAgents, currentAgent, switchAgent, loading } = useAgent();

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case 'sales':
        return <ShoppingBag className="h-6 w-6" />;
      case 'product_expert':
        return <Star className="h-6 w-6" />;
      case 'support':
        return <Headphones className="h-6 w-6" />;
      default:
        return <Bot className="h-6 w-6" />;
    }
  };

  const getAgentColor = (agentType) => {
    switch (agentType) {
      case 'sales':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'product_expert':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'support':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getAgentActiveColor = (agentType) => {
    switch (agentType) {
      case 'sales':
        return 'bg-green-500 text-white border-green-500';
      case 'product_expert':
        return 'bg-blue-500 text-white border-blue-500';
      case 'support':
        return 'bg-purple-500 text-white border-purple-500';
      default:
        return 'bg-gray-500 text-white border-gray-500';
    }
  };

  const handleAgentSwitch = async (agentType) => {
    if (currentAgent?.type === agentType) return;
    
    try {
      await switchAgent(agentType);
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to switch agent:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Choose Your AI Assistant
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Select the AI assistant that best matches your needs
          </p>
        </div>

        {/* Agent List */}
        <div className="p-6 space-y-4">
          {availableAgents.map((agent) => (
            <div
              key={agent.type}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                currentAgent?.type === agent.type
                  ? getAgentActiveColor(agent.type)
                  : `bg-white ${getAgentColor(agent.type)} hover:shadow-lg`
              }`}
              onClick={() => handleAgentSwitch(agent.type)}
            >
              {/* Active Indicator */}
              {currentAgent?.type === agent.type && (
                <div className="absolute top-2 right-2">
                  <Check className="h-5 w-5" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Agent Icon */}
                <div className={`p-3 rounded-full ${
                  currentAgent?.type === agent.type
                    ? 'bg-white bg-opacity-20'
                    : 'bg-white'
                }`}>
                  <div className={currentAgent?.type === agent.type ? 'text-white' : ''}>
                    {getAgentIcon(agent.type)}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${
                    currentAgent?.type === agent.type ? 'text-white' : 'text-gray-900'
                  }`}>
                    {agent.name}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    currentAgent?.type === agent.type ? 'text-white text-opacity-90' : 'text-gray-600'
                  }`}>
                    {agent.description}
                  </p>

                  {/* Agent Capabilities */}
                  <div className="mt-3">
                    {agent.type === 'sales' && (
                      <div className="flex flex-wrap gap-1">
                        {['Recommendations', 'Deals', 'Shopping Guide'].map((capability) => (
                          <span
                            key={capability}
                            className={`text-xs px-2 py-1 rounded-full ${
                              currentAgent?.type === agent.type
                                ? 'bg-white bg-opacity-20 text-white'
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {agent.type === 'product_expert' && (
                      <div className="flex flex-wrap gap-1">
                        {['Specifications', 'Comparisons', 'Technical Help'].map((capability) => (
                          <span
                            key={capability}
                            className={`text-xs px-2 py-1 rounded-full ${
                              currentAgent?.type === agent.type
                                ? 'bg-white bg-opacity-20 text-white'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {agent.type === 'support' && (
                      <div className="flex flex-wrap gap-1">
                        {['Order Tracking', 'Returns', 'Account Help'].map((capability) => (
                          <span
                            key={capability}
                            className={`text-xs px-2 py-1 rounded-full ${
                              currentAgent?.type === agent.type
                                ? 'bg-white bg-opacity-20 text-white'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && currentAgent?.type === agent.type && (
                <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              💡 <strong>Pro Tip:</strong> The system automatically switches agents based on your questions
            </p>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSelector;