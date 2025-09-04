// src/components/cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ShoppingBag,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import CartItem from './CartItem';
import { useAuth } from '../../context/AuthContext';
import { useAgent } from '../../context/AgentContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const { sendMessage, setIsOpen } = useAgent();
  const navigate = useNavigate();

  // Mock cart data - replace with actual API calls
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCartItems = [
        {
          id: 1,
          product: {
            id: 1,
            name: 'iPhone 15 Pro',
            price: 999.00,
            image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
            category: 'Electronics',
            stock_quantity: 50
          },
          quantity: 1,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          product: {
            id: 4,
            name: 'Sony WH-1000XM5 Headphones',
            price: 399.00,
            image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
            category: 'Electronics',
            stock_quantity: 75
          },
          quantity: 2,
          created_at: new Date().toISOString()
        }
      ];
      setCartItems(mockCartItems);
    } catch (error) {
      toast.error('Failed to load cart items');
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
      return;
    }

    try {
      setUpdating(true);
      // Mock API call - replace with actual API call
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdating(true);
      // Mock API call - replace with actual API call
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Error removing item:', error);
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    try {
      setUpdating(true);
      // Mock API call - replace with actual API call
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
      console.error('Error clearing cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const askAboutCart = () => {
    const cartContext = {
      cart_items: cartItems.map(item => ({
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      cart_total: calculateTotal(),
      items_count: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
    
    setIsOpen(true);
    sendMessage('I have some questions about my cart. Can you help me?', cartContext);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="flex space-x-3">
            <button
              onClick={askAboutCart}
              className="flex items-center px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <MessageCircle size={16} className="mr-2" />
              Ask AI
            </button>
            <button
              onClick={clearCart}
              disabled={updating}
              className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} className="mr-2" />
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <div className="text-center py-16">
          <div className="mb-6">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        // Cart Items
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                updating={updating}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {calculateShipping() === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `$${calculateShipping().toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {calculateShipping() > 0 && (
                  <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    💡 Add ${(50 - calculateSubtotal()).toFixed(2)} more for free shipping!
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={updating}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 mt-6 flex items-center justify-center"
              >
                <CreditCard size={20} className="mr-2" />
                Proceed to Checkout
                <ArrowRight size={20} className="ml-2" />
              </button>
              
              <button
                onClick={() => navigate('/shop')}
                className="w-full text-primary-600 border border-primary-600 py-3 px-4 rounded-lg font-medium hover:bg-primary-50 transition-colors mt-3"
              >
                Continue Shopping
              </button>
              
              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    30-Day Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;