import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart,
  Share2,
  Star,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  MessageCircle,
  ChevronLeft,
  Package,
  Check,
  AlertCircle,
  Tag,
  Info,
  Clock,
  MapPin,
  CreditCard,
  Award,
  Users,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Play,
  Zap,
  Gift
} from 'lucide-react';
import { productService } from '../../services/products';
import { useAgent } from '../../context/AgentContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { askAboutProduct } = useAgent();
  const { user } = useAuth();
  
  // Product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // UI state
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadProduct();
    loadRelatedProducts();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'reviews' && reviews.length === 0) {
      loadReviews();
    }
  }, [activeTab]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProduct(id);
      setProduct(data);
      
      // Check if product is in wishlist (simulate API call)
      const wishlistStatus = localStorage.getItem(`wishlist_${id}`) === 'true';
      setIsWishlisted(wishlistStatus);
      
    } catch (error) {
      toast.error('Failed to load product');
      console.error('Error loading product:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const params = { limit: 4, category: product?.category };
      const data = await productService.getProducts(params);
      setRelatedProducts(data.filter(p => p.id !== parseInt(id)));
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      // Simulate API call - replace with actual API
      const mockReviews = [
        {
          id: 1,
          user: { name: 'Sarah Johnson', avatar: '/api/placeholder/40/40' },
          rating: 5,
          date: '2024-02-15',
          comment: 'Amazing product! Exceeded my expectations in every way. The quality is outstanding and delivery was super fast. Would definitely purchase again!',
          helpful: 12,
          images: ['/api/placeholder/100/100'],
          verified: true
        },
        {
          id: 2,
          user: { name: 'Mike Chen', avatar: '/api/placeholder/40/40' },
          rating: 4,
          date: '2024-02-10',
          comment: 'Great value for money. Good quality and works as described. Minor packaging issue but customer service resolved it quickly.',
          helpful: 8,
          verified: true
        },
        {
          id: 3,
          user: { name: 'Emily Davis', avatar: '/api/placeholder/40/40' },
          rating: 4,
          date: '2024-02-08',
          comment: 'Very happy with this purchase. The product is exactly as shown and arrived quickly. Would recommend to others.',
          helpful: 6,
          verified: false
        },
        {
          id: 4,
          user: { name: 'David Wilson', avatar: '/api/placeholder/40/40' },
          rating: 5,
          date: '2024-02-05',
          comment: 'Excellent product! The build quality is fantastic and it works perfectly. Customer service was also very helpful.',
          helpful: 15,
          verified: true
        },
        {
          id: 5,
          user: { name: 'Lisa Anderson', avatar: '/api/placeholder/40/40' },
          rating: 3,
          date: '2024-02-01',
          comment: 'Good product overall, but took longer to arrive than expected. Quality is decent for the price point.',
          helpful: 3,
          verified: true
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleAskAboutProduct = () => {
    if (product) {
      askAboutProduct(product.id, `I'm looking at ${product.name}. Can you tell me more about its features, specifications, and help me decide if it's right for me?`);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock_quantity === 0) return;
    
    setIsAddingToCart(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add to local cart (in real app, this would be an API call)
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image_url,
        addedAt: new Date().toISOString()
      };
      
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      toast.success(`Added ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to cart!`, {
        icon: '🛒',
      });
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    const newWishlistStatus = !isWishlisted;
    setIsWishlisted(newWishlistStatus);
    
    // Store in localStorage (in real app, this would be an API call)
    localStorage.setItem(`wishlist_${id}`, newWishlistStatus.toString());
    
    toast.success(
      newWishlistStatus ? 'Added to wishlist ❤️' : 'Removed from wishlist',
      { icon: newWishlistStatus ? '❤️' : '💔' }
    );
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast.success('Product URL copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product URL copied to clipboard!');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      // Simulate API call
      const review = {
        id: Date.now(),
        user: { name: user.first_name + ' ' + user.last_name, avatar: '/api/placeholder/40/40' },
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0],
        comment: newReview.comment,
        helpful: 0,
        verified: true
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    }
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
    if (!product) return { text: '', color: '', textColor: '', icon: Info };
    
    if (product.stock_quantity === 0) {
      return { text: 'Out of Stock', color: 'bg-red-100', textColor: 'text-red-600', icon: AlertCircle };
    } else if (product.stock_quantity <= 5) {
      return { text: `Only ${product.stock_quantity} left!`, color: 'bg-orange-100', textColor: 'text-orange-600', icon: AlertCircle };
    } else if (product.stock_quantity <= 10) {
      return { text: 'Limited Stock', color: 'bg-yellow-100', textColor: 'text-yellow-600', icon: Info };
    }
    return { text: 'In Stock', color: 'bg-green-100', textColor: 'text-green-600', icon: Check };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-300 h-16 w-16 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded"></div>
              <div className="bg-gray-300 h-4 rounded w-3/4"></div>
              <div className="bg-gray-300 h-6 rounded w-1/2"></div>
              <div className="bg-gray-300 h-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <button
          onClick={() => navigate('/shop')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const images = product.image_url ? [product.image_url, product.image_url, product.image_url] : ['/api/placeholder/600/400'];
  const averageRating = calculateAverageRating();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-lg border group">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover cursor-zoom-in"
              onClick={() => setShowImageModal(true)}
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={() => setShowImageModal(true)}
                className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300"
              >
                <Camera size={16} />
                <span>View Full Size</span>
              </button>
            </div>
            
            {/* Stock Status Badge */}
            <div className={`absolute top-4 left-4 ${stockStatus.color} px-3 py-1 rounded-full flex items-center space-x-1`}>
              <stockStatus.icon size={14} className={stockStatus.textColor} />
              <span className={`text-sm font-medium ${stockStatus.textColor}`}>
                {stockStatus.text}
              </span>
            </div>

            {/* Category Tag */}
            {product.category && (
              <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <Tag size={14} />
                <span className="text-sm">{product.category}</span>
              </div>
            )}

            {/* Discount Badge */}
            {product.price < 100 && (
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                <Gift size={14} />
                <span className="text-sm font-medium">Great Deal!</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                  selectedImage === index ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Truck size={20} className="text-green-600" />
              <div>
                <div className="font-medium text-sm">Free Delivery</div>
                <div className="text-xs text-gray-600">Orders over $50</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-blue-600" />
              <div>
                <div className="font-medium text-sm">Warranty</div>
                <div className="text-xs text-gray-600">1 year coverage</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw size={20} className="text-orange-600" />
              <div>
                <div className="font-medium text-sm">Easy Returns</div>
                <div className="text-xs text-gray-600">30 day policy</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award size={20} className="text-purple-600" />
              <div>
                <div className="font-medium text-sm">Quality</div>
                <div className="text-xs text-gray-600">Premium grade</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({averageRating}) • {reviews.length} reviews
                </span>
              </div>
              <div className={`flex items-center space-x-1 ${stockStatus.color} px-2 py-1 rounded`}>
                <stockStatus.icon size={14} className={stockStatus.textColor} />
                <span className={`text-sm font-medium ${stockStatus.textColor}`}>
                  {stockStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Price and Savings */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              {product.price > 50 && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  <Truck size={14} />
                  <span>Free Shipping</span>
                </div>
              )}
            </div>
            {product.price < 100 && (
              <div className="text-green-600 text-sm font-medium">
                Save 20% • Limited time offer
              </div>
            )}
          </div>

          {/* Quick Description */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-800 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Key Features:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-center space-x-2">
                <Check size={16} className="text-green-600" />
                <span>Premium quality materials</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={16} className="text-green-600" />
                <span>Fast and reliable performance</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={16} className="text-green-600" />
                <span>Easy to use and maintain</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check size={16} className="text-green-600" />
                <span>Excellent customer support</span>
              </li>
            </ul>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock_quantity}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <span className="text-sm text-gray-600 flex items-center space-x-1">
              <Package size={14} />
              <span>({product.stock_quantity} available)</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || isAddingToCart}
                className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <ShoppingCart size={20} />
                )}
                <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap size={20} />
                <span>Buy Now</span>
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 flex items-center justify-center space-x-2 border-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>

            {/* Ask AI Button */}
            <button
              onClick={handleAskAboutProduct}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={20} />
              <span>Ask AI Assistant About This Product</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 pt-4 border-t">
            <div className="text-center">
              <div className="font-bold text-lg text-green-600">4.5★</div>
              <div className="text-xs text-gray-600">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-blue-600">500+</div>
              <div className="text-xs text-gray-600">Orders</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-purple-600">98%</div>
              <div className="text-xs text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="border-b">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {tab === 'reviews' && (
                  <span className="ml-1 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {reviews.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Product Description</h3>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  {product.description}
                </p>
                <p className="leading-relaxed">
                  This premium product offers exceptional quality and performance. 
                  Crafted with attention to detail and built to last, it represents 
                  excellent value for your investment. Perfect for both personal and 
                  professional use, this item will exceed your expectations.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">Why Choose This Product?</h4>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Premium materials and construction</li>
                    <li>• Rigorous quality testing</li>
                    <li>• Excellent customer service</li>
                    <li>• Fast and reliable shipping</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">General Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Category:</span>
                      <span className="text-gray-900">{product.category}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Stock Quantity:</span>
                      <span className="text-gray-900">{product.stock_quantity} units</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Weight:</span>
                      <span className="text-gray-900">2.5 kg</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Dimensions:</span>
                      <span className="text-gray-900">25 x 15 x 10 cm</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Model Number:</span>
                      <span className="text-gray-900">PRD-{product.id}-2024</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">SKU:</span>
                      <span className="text-gray-900">SKU{product.id.toString().padStart(6, '0')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Product Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Material:</span>
                      <span className="text-gray-900">Premium Quality</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Color:</span>
                      <span className="text-gray-900">Multi-color</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Warranty:</span>
                      <span className="text-gray-900">1 Year Limited</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Country of Origin:</span>
                      <span className="text-gray-900">Made in USA</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Energy Rating:</span>
                      <span className="text-gray-900">A+ Certified</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Certifications:</span>
                      <span className="text-gray-900">CE, FCC, RoHS</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Technical Features */}
              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Technical Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="text-blue-600" size={16} />
                        <span className="font-medium text-blue-900">Performance</span>
                      </div>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• High-speed processing</li>
                        <li>• Energy efficient design</li>
                        <li>• Optimized performance</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="text-green-600" size={16} />
                        <span className="font-medium text-green-900">Safety</span>
                      </div>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Safety certified</li>
                        <li>• Overload protection</li>
                        <li>• Temperature control</li>
                      </ul>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="text-purple-600" size={16} />
                        <span className="font-medium text-purple-900">Quality</span>
                      </div>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Premium materials</li>
                        <li>• Rigorous testing</li>
                        <li>• Quality assurance</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Package Contents */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <Package className="text-gray-600" size={18} />
                    <span>Package Contents</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center space-x-2">
                        <Check className="text-green-600" size={14} />
                        <span>1x {product.name}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="text-green-600" size={14} />
                        <span>User Manual (English)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="text-green-600" size={14} />
                        <span>Quick Setup Guide</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center space-x-2">
                        <Check className="text-green-600" size={14} />
                        <span>Warranty Card</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="text-green-600" size={14} />
                        <span>Quality Assurance Certificate</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="text-green-600" size={14} />
                        <span>Customer Support Information</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Compatibility Information */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <Info className="text-blue-600" size={18} />
                    <span>Compatibility & Requirements</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3">System Requirements</h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Operating Temperature: 0°C to 40°C</li>
                        <li>• Storage Temperature: -20°C to 70°C</li>
                        <li>• Humidity: 10% to 90% non-condensing</li>
                        <li>• Power Requirements: 100-240V AC</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3">Compatibility</h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Compatible with standard interfaces</li>
                        <li>• Universal mounting system</li>
                        <li>• Cross-platform support</li>
                        <li>• Multiple connection options</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;