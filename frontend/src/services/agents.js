import api from './api';

export const agentService = {
  async chatWithAgent(message, context = null) {
    const response = await api.post('/agents/chat', {
      message,
      context
    });
    return response.data;
  },

  async switchAgent(agentType) {
    const response = await api.post('/agents/switch-agent', {
      agent_type: agentType
    });
    return response.data;
  },

  async getAvailableAgents() {
    const response = await api.get('/agents/available');
    return response.data;
  },

  async productInquiry(productId, message) {
    const response = await api.post(`/agents/product-inquiry/${productId}`, {
      message
    });
    return response.data;
  },

  async getOrderStatus(orderId) {
    const response = await api.get(`/agents/order-status/${orderId}`);
    return response.data;
  }
};