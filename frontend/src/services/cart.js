import api from './api';

export const cartService = {
  // Get user's cart items
  async getCartItems() {
    const response = await api.get('/cart/');
    return response.data;
  },

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add', {
      product_id: productId,
      quantity: quantity
    });
    return response.data;
  },

  // Update cart item quantity
  async updateCartItem(cartItemId, quantity) {
    const response = await api.put(`/cart/items/${cartItemId}`, {
      quantity: quantity
    });
    return response.data;
  },

  // Remove item from cart
  async removeFromCart(cartItemId) {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  // Clear entire cart
  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  // Get cart summary (total items, total price)
  async getCartSummary() {
    const response = await api.get('/cart/summary');
    return response.data;
  },

  // Apply coupon to cart
  async applyCoupon(couponCode) {
    const response = await api.post('/cart/apply-coupon', {
      coupon_code: couponCode
    });
    return response.data;
  },

  // Remove coupon from cart
  async removeCoupon() {
    const response = await api.delete('/cart/remove-coupon');
    return response.data;
  },

  // Calculate shipping for cart
  async calculateShipping(shippingAddress) {
    const response = await api.post('/cart/calculate-shipping', {
      shipping_address: shippingAddress
    });
    return response.data;
  },

  // Get cart total with tax and shipping
  async getCartTotal(shippingAddress = null) {
    const params = shippingAddress ? { shipping_address: shippingAddress } : {};
    const response = await api.get('/cart/total', { params });
    return response.data;
  },

  // Save cart for later (for guest users)
  async saveCartForLater() {
    const response = await api.post('/cart/save-for-later');
    return response.data;
  },

  // Restore saved cart
  async restoreSavedCart(cartId) {
    const response = await api.post(`/cart/restore/${cartId}`);
    return response.data;
  }
};