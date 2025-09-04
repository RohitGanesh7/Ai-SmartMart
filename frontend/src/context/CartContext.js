import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cart';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Load cart when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      clearCart();
    }
  }, [isAuthenticated, user]);

  // Calculate totals when cart items change
  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const calculateTotals = () => {
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    const count = cartItems.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    setCartTotal(total);
    setItemCount(count);
  };

  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const items = await cartService.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.product.id === productId);
      
      if (existingItem) {
        // Update quantity of existing item
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        toast.success('Item quantity updated in cart');
      } else {
        // Add new item to cart
        const newItem = await cartService.addToCart(productId, quantity);
        setCartItems(prevItems => [...prevItems, newItem]);
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(cartItemId);
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      setLoading(true);
      const updatedItem = await cartService.updateQuantity(cartItemId, newQuantity);
      
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItemId ? updatedItem : item
        )
      );
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      await cartService.clearCart();
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product.id === productId);
  };

  const getCartItemByProductId = (productId) => {
    return cartItems.find(item => item.product.id === productId);
  };

  const proceedToCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    try {
      setLoading(true);
      // Create checkout session or prepare order data
      const checkoutData = {
        items: cartItems,
        total: cartTotal,
        itemCount: itemCount
      };
      
      return checkoutData;
    } catch (error) {
      console.error('Failed to proceed to checkout:', error);
      toast.error('Failed to proceed to checkout');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    cartItems,
    loading,
    cartTotal,
    itemCount,
    
    // Actions
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    proceedToCheckout,
    
    // Utilities
    isInCart,
    getCartItemByProductId,
    
    // Computed values
    isEmpty: cartItems.length === 0,
    formattedTotal: cartTotal.toFixed(2)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};