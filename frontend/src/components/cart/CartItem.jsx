// src/components/cart/CartItem.jsx
import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

const CartItem = ({ item, onUpdateQuantity, onRemove, updating }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const { askAboutProduct } = useAgent();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item.id);
    setIsRemoving(false);
  };

  const handleAskAboutProduct = () => {
    askAboutProduct(item.product.id, `I have this in my cart. Can you tell me more about the ${item.product.name}?`);
  };

  const itemTotal = item.product.price * quantity;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.product.image_url || '/api/placeholder/100/100'}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Category: {item.product.category}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-lg font-semibold text-primary-600">
                  ${item.product.price.toFixed(2)}
                </span>
                {quantity > 1 && (
                  <span className="text-sm text-gray-500">
                    × {quantity} = ${itemTotal.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={handleAskAboutProduct}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                title="Ask AI about this product"
              >
                <MessageCircle size={18} />
              </button>
              
              <button
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Add to wishlist"
              >
                <Heart size={18} />
              </button>
              
              <button
                onClick={handleRemove}
                disabled={isRemoving || updating}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                title="Remove from cart"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Quantity Controls and Stock Info */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || updating}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                
                <div className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                  <span className="font-medium">{quantity}</span>
                </div>
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= item.product.stock_quantity || updating}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Stock Status */}
              <div className="text-sm">
                {item.product.stock_quantity <= 5 && item.product.stock_quantity > 0 ? (
                  <span className="text-orange-600 font-medium">
                    Only {item.product.stock_quantity} left!
                  </span>
                ) : item.product.stock_quantity > 0 ? (
                  <span className="text-green-600">
                    In Stock ({item.product.stock_quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                ${itemTotal.toFixed(2)}
              </div>
              {quantity > 1 && (
                <div className="text-sm text-gray-500">
                  ${item.product.price.toFixed(2)} each
                </div>
              )}
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm">
              <button className="text-primary-600 hover:text-primary-700 flex items-center">
                <ExternalLink size={14} className="mr-1" />
                View Details
              </button>
              
              <button className="text-gray-600 hover:text-gray-700">
                Save for Later
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              Added {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(updating || isRemoving) && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      )}
    </div>
  );
};

export default CartItem;