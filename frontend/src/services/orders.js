import api from './api';

export const orderService = {
  // Get user's order history
  async getOrders(params = {}) {
    const response = await api.get('/orders/', { params });
    return response.data;
  },

  // Get specific order details
  async getOrder(orderId) {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create new order from cart
  async createOrder(orderData) {
    const response = await api.post('/orders/', {
      shipping_address: orderData.shipping_address,
      payment_method_id: orderData.payment_method_id,
      billing_address: orderData.billing_address,
      shipping_method: orderData.shipping_method,
      notes: orderData.notes
    });
    return response.data;
  },

  // Create order with specific items (not from cart)
  async createOrderWithItems(orderData) {
    const response = await api.post('/orders/create-with-items', {
      items: orderData.items, // Array of {product_id, quantity, price}
      shipping_address: orderData.shipping_address,
      payment_method_id: orderData.payment_method_id,
      billing_address: orderData.billing_address,
      shipping_method: orderData.shipping_method,
      notes: orderData.notes
    });
    return response.data;
  },

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    const response = await api.post(`/orders/${orderId}/cancel`, {
      reason: reason
    });
    return response.data;
  },

  // Update order status (admin only)
  async updateOrderStatus(orderId, status, trackingNumber = null) {
    const response = await api.put(`/orders/${orderId}/status`, {
      status: status,
      tracking_number: trackingNumber
    });
    return response.data;
  },

  // Track order
  async trackOrder(orderId) {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  },

  // Get order invoice
  async getOrderInvoice(orderId) {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob' // For PDF download
    });
    return response.data;
  },

  // Download order invoice
  async downloadInvoice(orderId) {
    const response = await api.get(`/orders/${orderId}/invoice/download`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response.data;
  },

  // Request order return
  async requestReturn(orderId, items, reason) {
    const response = await api.post(`/orders/${orderId}/return`, {
      items: items, // Array of {order_item_id, quantity, reason}
      reason: reason
    });
    return response.data;
  },

  // Get return status
  async getReturnStatus(orderId) {
    const response = await api.get(`/orders/${orderId}/return-status`);
    return response.data;
  },

  // Reorder (create new order with same items)
  async reorder(orderId) {
    const response = await api.post(`/orders/${orderId}/reorder`);
    return response.data;
  },

  // Get order statistics (admin)
  async getOrderStats(params = {}) {
    const response = await api.get('/orders/stats', { params });
    return response.data;
  },

  // Process refund (admin only)
  async processRefund(orderId, amount, reason = '') {
    const response = await api.post(`/orders/${orderId}/refund`, {
      amount: amount,
      reason: reason
    });
    return response.data;
  },

  // Update shipping address
  async updateShippingAddress(orderId, newAddress) {
    const response = await api.put(`/orders/${orderId}/shipping-address`, {
      shipping_address: newAddress
    });
    return response.data;
  },

  // Add order notes
  async addOrderNote(orderId, note) {
    const response = await api.post(`/orders/${orderId}/notes`, {
      note: note
    });
    return response.data;
  },

  // Get order notes
  async getOrderNotes(orderId) {
    const response = await api.get(`/orders/${orderId}/notes`);
    return response.data;
  },

  // Estimate delivery date
  async estimateDelivery(orderId) {
    const response = await api.get(`/orders/${orderId}/delivery-estimate`);
    return response.data;
  },

  // Update delivery preferences
  async updateDeliveryPreferences(orderId, preferences) {
    const response = await api.put(`/orders/${orderId}/delivery-preferences`, {
      delivery_instructions: preferences.delivery_instructions,
      preferred_delivery_time: preferences.preferred_delivery_time,
      leave_at_door: preferences.leave_at_door,
      signature_required: preferences.signature_required
    });
    return response.data;
  }
};