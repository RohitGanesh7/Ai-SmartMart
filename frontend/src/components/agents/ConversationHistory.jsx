import React, { useState, useMemo } from 'react';
import { useAgent } from '../../context/AgentContext';
import { useAuth } from '../../context/AuthContext';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Bot, 
  User, 
  Calendar,
  MessageCircle,
  Star,
  MoreVertical,
  Copy,
  Share
} from 'lucide-react';

const ConversationHistory = ({ isOpen, onClose }) => {
  const { conversation, clearConversation } = useAgent();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAgent, setFilterAgent] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMessages, setSelectedMessages] = useState([]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversation.filter(msg => {
      // Search filter
      if (searchTerm && !msg.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Agent filter
      if (filterAgent !== 'all' && msg.agentType !== filterAgent) {
        return false;
      }
      
      return true;
    });

    // Sort conversations
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
    });
  }, [conversation, searchTerm, filterAgent, sortBy]);

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const groups = {};
    filteredConversations.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  }, [filteredConversations]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case 'sales':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'product_expert':
        return <Star className="h-4 w-4 text-blue-600" />;
      case 'support':
        return <Bot className="h-4 w-4 text-purple-600" />;
      default:
        return <Bot className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message.content);
    // You could show a toast notification here
  };

  const handleExportConversation = () => {
    const exportData = {
      user: user?.username || 'User',
      exportDate: new Date().toISOString(),
      totalMessages: conversation.length,
      conversations: conversation.map(msg => ({
        timestamp: msg.timestamp,
        type: msg.type,
        agentName: msg.agentName,
        agentType: msg.agentType,
        content: msg.content
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `conversation-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all conversation history? This action cannot be undone.')) {
      clearConversation();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <History className="h-6 w-6 text-primary-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Conversation History
                </h2>
                <p className="text-sm text-gray-600">
                  {conversation.length} messages • {Object.keys(groupedConversations).length} conversation sessions
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
              />
            </div>

            {/* Agent Filter */}
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
            >
              <option value="all">All Agents</option>
              <option value="sales">Sales Assistant</option>
              <option value="product_expert">Product Expert</option>
              <option value="support">Customer Support</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredConversations.length} of {conversation.length} messages shown
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportConversation}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                disabled={conversation.length === 0}
              >
                <Download size={14} />
                <span>Export</span>
              </button>
              <button
                onClick={handleClearHistory}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                disabled={conversation.length === 0}
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              {conversation.length === 0 ? (
                <div className="text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                  <p className="text-sm">Start chatting with our AI assistants to see your conversation history here.</p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No matching conversations</h3>
                  <p className="text-sm">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedConversations).map(([date, messages]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <Calendar size={14} />
                      <span>{date}</span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {msg.type === 'user' ? (
                              <div className="flex items-center space-x-2">
                                <User size={16} className="text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">You</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                {getAgentIcon(msg.agentType)}
                                <span className="text-sm font-medium text-gray-900">
                                  {msg.agentName || 'AI Assistant'}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(msg.timestamp)}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleCopyMessage(msg)}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                title="Copy message"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-700 leading-relaxed">
                          {msg.content}
                        </div>

                        {/* Suggested Actions */}
                        {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.suggestedActions.slice(0, 3).map((action, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                              >
                                {action.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              💡 Your conversation history is stored locally and cleared when you log out
            </span>
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

export default ConversationHistory;