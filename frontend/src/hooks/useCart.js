import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cart';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Load cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCartItems();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const loadCartItems = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const items = await cartService.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart items:', error);
      setError('Failed to load cart items');
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await cartService.addToCart(productId, quantity);
      
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(
        item => item.product_id === productId
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex] = response;
        setCartItems(updatedItems);
        toast.success('Cart updated successfully!');
      } else {
        // Add new item
        setCartItems(prevItems => [...prevItems, response]);
        toast.success('Added to cart!');
      }

      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to add item to cart';
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isAuthenticated) return false;

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      setLoading(true);
      const response = await cartService.updateCartItem(itemId, quantity);
      
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? response : item
      );
      setCartItems(updatedItems);
      
      toast.success('Cart updated!');
      return true;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      await cartService.removeFromCart(itemId);
      
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      await cartService.clearCart();
      setCartItems([]);
      toast.success('Cart cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  // Computed values
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const cartSubtotal = cartTotal;
  const taxAmount = cartTotal * 0.08; // 8% tax
  const shippingFee = cartTotal > 50 ? 0 : 9.99; // Free shipping over $50
  const grandTotal = cartSubtotal + taxAmount + shippingFee;

  const isEmpty = cartItems.length === 0;
  const hasItems = cartItems.length > 0;

  // Cart summary for checkout
  const cartSummary = {
    items: cartItems,
    subtotal: cartSubtotal,
    tax: taxAmount,
    shipping: shippingFee,
    total: grandTotal,
    count: cartCount
  };

  return {
    // State
    cartItems,
    loading,
    error,
    
    // Actions
    loadCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    
    // Utilities
    getItemQuantity,
    isInCart,
    
    // Computed values
    cartCount,
    cartTotal,
    cartSubtotal,
    taxAmount,
    shippingFee,
    grandTotal,
    isEmpty,
    hasItems,
    cartSummary,
    
    // Cart state helpers
    isProcessing: loading,
    hasError: !!error
  };
};