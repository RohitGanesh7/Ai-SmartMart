import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAgent } from '../context/AgentContext';
import { 
  ShoppingBag, 
  Zap, 
  Shield, 
  Truck, 
  Star,
  ArrowRight,
  Bot,
  MessageCircle,
  TrendingUp,
  Award,
  Users,
  Heart
} from 'lucide-react';
// import { ProductCard } from '../components/products/ProductList';
import { productService } from '../services/products';
import toast from 'react-hot-toast';
import ProductCard from '../components/products/ProductCard';

const Home = () => {
  const { user } = useAuth();
  const { setIsOpen, sendMessage } = useAgent();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productService.getProducts({ limit: 8 });
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartShopping = () => {
    setIsOpen(true);
    sendMessage("Hi! I'm ready to start shopping. Can you show me your best products?");
  };

  const handleAIDemo = () => {
    setIsOpen(true);
    sendMessage("I'd like to see how your AI shopping assistants work. Can you give me a demo?");
  };

  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: 'AI Shopping Assistant',
      description: 'Get personalized recommendations and instant help from our AI-powered shopping assistants.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Quick browsing, instant search, and speedy checkout for the best shopping experience.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Payments',
      description: 'Your transactions are protected with bank-level security and encryption.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $50 with tracking and delivery notifications.',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, label: 'Happy Customers', value: '10K+' },
    { icon: <ShoppingBag className="h-6 w-6" />, label: 'Products', value: '5K+' },
    { icon: <Award className="h-6 w-6" />, label: 'Awards Won', value: '15+' },
    { icon: <Heart className="h-6 w-6" />, label: 'Reviews', value: '99%' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/50 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-bounce-slow mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                <Bot className="mr-2 h-4 w-4" />
                Now with AI Shopping Assistants
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                SmartShop
              </span>
              {user && (
                <span className="block text-3xl md:text-4xl mt-4 text-blue-200 animate-pulse">
                  Hi, {user.first_name || user.username}! 👋
                </span>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Experience the future of shopping with AI-powered assistance. Get personalized recommendations, 
              instant support, and a seamless shopping experience tailored just for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleStartShopping}
                className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <MessageCircle className="mr-2 group-hover:animate-bounce" size={20} />
                Start Shopping with AI
              </button>
              
              <Link
                to="/shop"
                className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Browse Products
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SmartShop?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing online shopping with AI-powered assistance and seamless user experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-4">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  AI-Powered Shopping
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Meet Your AI Shopping Team
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our intelligent agents are here to help you every step of the way. 
                  From product discovery to post-purchase support, we've got you covered.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
                    <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                      <ShoppingBag className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Emma - Sales Assistant</h3>
                      <p className="text-gray-600">Get personalized recommendations and discover amazing deals</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
                    <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Alex - Product Expert</h3>
                      <p className="text-gray-600">Deep product knowledge and technical specifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
                    <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Sam - Customer Support</h3>
                      <p className="text-gray-600">Order tracking, returns, and account assistance</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={handleAIDemo}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="mr-2" size={20} />
                    Try AI Demo
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(true)}
                    className="border border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center"
                  >
                    <Bot className="mr-2" size={20} />
                    Chat Now
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-8 rounded-2xl">
                  <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse-slow">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Emma - Sales Assistant</p>
                        <p className="text-xs text-green-500 flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          Online now
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-600">
                        <p className="text-sm text-gray-800">
                          👋 Hi! I noticed you're looking at electronics. Based on your browsing, 
                          I'd recommend checking out our latest smartphone deals - we have 20% off this week!
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs border border-blue-200 transition-colors">
                          Show me deals 🔥
                        </button>
                        <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs border border-blue-200 transition-colors">
                          Compare products 📱
                        </button>
                        <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs border border-blue-200 transition-colors">
                          Track my order 📦
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular items, handpicked just for you
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors transform hover:scale-105 shadow-lg"
            >
              View All Products
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Smart Shopping?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've discovered a better way to shop online. 
            Get started with our AI assistants today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartShopping}
              className="group bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="inline mr-2 group-hover:animate-bounce" size={20} />
              Start Shopping Now
            </button>
            <Link
              to="/shop"
              className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
            >
              Browse Products
              <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated with SmartShop
            </h2>
            <p className="text-gray-600 mb-8">
              Get the latest product updates, exclusive deals, and AI shopping tips delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
              <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;