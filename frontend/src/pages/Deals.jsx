import React, { useState, useEffect } from 'react';
import { productService } from '../services/products';
import { useAgent } from '../context/AgentContext';
import { 
  Percent, 
  Clock, 
  Zap, 
  Gift, 
  Star, 
//   Fire,
  Tag,
  Timer,
  TrendingUp,
  ShoppingCart,
  Eye,
  MessageCircle,
  FireExtinguisherIcon
} from 'lucide-react';
import { ProductCard } from '../components/products/ProductList';
import toast from 'react-hot-toast';

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('flash');
  const { sendMessage, setIsOpen, askAboutProduct } = useAgent();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Get all products and simulate deals
      const allProducts = await productService.getProducts({ limit: 50 });
      
      // Simulate different types of deals
      const productsWithDeals = allProducts.map((product, index) => ({
        ...product,
        originalPrice: product.price,
        discount: getRandomDiscount(index),
        dealType: getDealType(index),
        timeLeft: getTimeLeft(index),
        isFlashDeal: index % 4 === 0,
        isHot: index % 3 === 0,
        dealEndTime: new Date(Date.now() + getRandomHours() * 60 * 60 * 1000)
      }));

      // Apply discounts
      const dealsProducts = productsWithDeals.map(product => ({
        ...product,
        price: product.originalPrice * (1 - product.discount / 100),
        savings: product.originalPrice * (product.discount / 100)
      }));

      setProducts(dealsProducts);
    } catch (error) {
      toast.error('Failed to load deals');
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomDiscount = (index) => {
    const discounts = [10, 15, 20, 25, 30, 35, 40, 50];
    return discounts[index % discounts.length];
  };

  const getDealType = (index) => {
    const types = ['Flash Sale', 'Daily Deal', 'Weekly Special', 'Limited Time', 'Hot Deal', 'Best Seller'];
    return types[index % types.length];
  };

  const getTimeLeft = (index) => {
    const times = ['2h 30m', '5h 45m', '1d 12h', '3h 15m', '8h 22m', '1d 5h'];
    return times[index % times.length];
  };

  const getRandomHours = () => Math.floor(Math.random() * 48) + 1;

  const handleAskAboutDeals = () => {
    setIsOpen(true);
    sendMessage("What are the best deals available right now? Can you recommend some products on sale?");
  };

  const handleDealInquiry = (product) => {
    askAboutProduct(product.id, `Tell me about this deal on ${product.name}. Is this a good discount?`);
  };

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'flash':
        return products.filter(p => p.isFlashDeal);
      case 'hot':
        return products.filter(p => p.isHot);
      case 'high':
        return products.filter(p => p.discount >= 30);
      case 'all':
      default:
        return products;
    }
  };

  const DealCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden relative group">
      {/* Deal Badge */}
      <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
        <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center">
          <Percent className="h-3 w-3 mr-1" />
          {product.discount}% OFF
        </span>
        {product.isFlashDeal && (
          <span className="bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            FLASH
          </span>
        )}
        {product.isHot && (
          <span className="bg-pink-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center">
            <FireExtinguisherIcon className="h-3 w-3 mr-1" />
            HOT
          </span>
        )}
      </div>

      {/* Timer Badge */}
      <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        {product.timeLeft}
      </div>

      <div className="relative">
        <img
          src={product.image_url || '/api/placeholder/300/200'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <span className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs font-semibold rounded">
            Only {product.stock_quantity} left!
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-2xl font-bold text-red-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-lg text-gray-500 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
          <span className="text-sm font-medium text-green-600">
            Save ${product.savings.toFixed(2)}
          </span>
        </div>

        {/* Deal Type */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded font-medium">
            {product.dealType}
          </span>
          <span className="text-xs text-gray-500">
            {product.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => handleDealInquiry(product)}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              title="Ask AI about this deal"
            >
              <MessageCircle size={18} />
            </button>
            
            <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
              <Eye size={18} />
            </button>
          </div>

          <button 
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart size={16} className="mr-2" />
            {product.stock_quantity === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Tag className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Amazing Deals & Offers
            </h1>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto mb-8">
              Don't miss out on incredible savings! Limited time offers with up to 50% off on your favorite products.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAskAboutDeals}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="mr-2" size={20} />
                Ask AI for Best Deals
              </button>
              
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors">
                View Flash Sales
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
            <div className="flex items-center">
              <Gift className="h-8 w-8 mr-3" />
              <div>
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-green-100">Active Deals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="flex items-center">
              <Zap className="h-8 w-8 mr-3" />
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.isFlashDeal).length}</p>
                <p className="text-blue-100">Flash Sales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
            <div className="flex items-center">
              <FireExtinguisherIcon className="h-8 w-8 mr-3" />
              <div>
                <p className="text-2xl font-bold">{products.filter(p => p.isHot).length}</p>
                <p className="text-purple-100">Hot Deals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 mr-3" />
              <div>
                <p className="text-2xl font-bold">50%</p>
                <p className="text-orange-100">Max Discount</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-lg shadow-md">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-red-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Deals ({products.length})
          </button>
          
          <button
            onClick={() => setActiveTab('flash')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'flash'
                ? 'bg-orange-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Zap className="inline h-4 w-4 mr-1" />
            Flash Sales ({products.filter(p => p.isFlashDeal).length})
          </button>
          
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'hot'
                ? 'bg-pink-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FireExtinguisherIcon className="inline h-4 w-4 mr-1" />
            Hot Deals ({products.filter(p => p.isHot).length})
          </button>
          
          <button
            onClick={() => setActiveTab('high')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'high'
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Star className="inline h-4 w-4 mr-1" />
            High Discount ({products.filter(p => p.discount >= 30).length})
          </button>
        </div>

        {/* Deals Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'flash' && 'Flash Sales'}
              {activeTab === 'hot' && 'Hot Deals'}
              {activeTab === 'high' && 'High Discount Deals'}
              {activeTab === 'all' && 'All Deals'}
            </h2>
            <p className="text-gray-600">
              {getFilteredProducts().length} deals available
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : getFilteredProducts().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredProducts().map((product) => (
                <DealCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-600 mb-6">
                Check back later for more amazing deals!
              </p>
              <button
                onClick={() => setActiveTab('all')}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                View All Deals
              </button>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 text-center">
          <Timer className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Never Miss a Deal!</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Get notified about flash sales, exclusive offers, and limited-time deals. 
            Be the first to know when your favorite products go on sale!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          
          <p className="text-xs text-purple-200 mt-4">
            No spam, unsubscribe at any time. Get exclusive deals delivered to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Deals;