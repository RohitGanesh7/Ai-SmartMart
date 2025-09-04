import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Eye, 
  MessageCircle, 
  Heart,
  Star,
  Plus,
  Minus,
  Package,
  Tag
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { askAboutProduct } = useAgent();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAskAboutProduct = () => {
    askAboutProduct(product.id, `Tell me about ${product.name}`);
  };

  const handleAddToCart = async () => {
    if (product.stock_quantity === 0) return;
    
    setIsAddingToCart(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Added ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getStockStatus = () => {
    if (product.stock_quantity === 0) {
      return { text: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-600' };
    } else if (product.stock_quantity <= 5) {
      return { text: `Only ${product.stock_quantity} left!`, color: 'bg-orange-500', textColor: 'text-orange-600' };
    } else if (product.stock_quantity <= 10) {
      return { text: 'Limited Stock', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    }
    return { text: 'In Stock', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <img
              src={product.image_url || '/api/placeholder/300/200'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              <span className={`${stockStatus.color} text-white px-2 py-1 text-xs font-semibold rounded`}>
                {stockStatus.text}
              </span>
              {product.category && (
                <span className="bg-gray-800 text-white px-2 py-1 text-xs rounded">
                  {product.category}
                </span>
              )}
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Heart 
                size={16} 
                className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'} 
              />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                  </div>
                  <span className={`text-xs font-medium ${stockStatus.textColor}`}>
                    {stockStatus.text}
                  </span>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <span className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.price > 100 && (
                  <div className="text-xs text-green-600 font-medium">
                    Free Shipping
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0 || isAddingToCart}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <ShoppingCart size={16} />
                  )}
                  <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>
              </div>
              
              {/* Secondary Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={handleAskAboutProduct}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                  title="Ask AI about this product"
                >
                  <MessageCircle size={18} />
                </button>
                
                <Link
                  to={`/products/${product.id}`}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                  title="View details"
                >
                  <Eye size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || '/api/placeholder/300/200'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/products/${product.id}`}
            className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            Quick View
          </Link>
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          <span className={`${stockStatus.color} text-white px-2 py-1 text-xs font-semibold rounded`}>
            {stockStatus.text}
          </span>
          {product.price < 50 && (
            <span className="bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded">
              Great Value
            </span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          <Heart 
            size={16} 
            className={isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'} 
          />
        </button>
        
        {/* Category Tag */}
        {product.category && (
          <span className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs rounded flex items-center">
            <Tag size={12} className="mr-1" />
            {product.category}
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/products/${product.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>
        
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">(4.0)</span>
          <span className={`text-xs font-medium ${stockStatus.textColor}`}>
            • {stockStatus.text}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price and Stock */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {product.price > 100 && (
              <div className="text-xs text-green-600 font-medium">
                Free Shipping
              </div>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Package size={12} className="mr-1" />
            {product.stock_quantity} in stock
          </div>
        </div>
        
        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={decrementQuantity}
              className="p-1 hover:bg-gray-100 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus size={12} />
            </button>
            <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="p-1 hover:bg-gray-100 transition-colors"
              disabled={quantity >= product.stock_quantity}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0 || isAddingToCart}
            className="flex-1 flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ShoppingCart size={14} />
            )}
            <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
          </button>
          
          <div className="flex space-x-1">
            <button
              onClick={handleAskAboutProduct}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Ask AI about this product"
            >
              <MessageCircle size={16} />
            </button>
            
            <Link
              to={`/products/${product.id}`}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="View details"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;