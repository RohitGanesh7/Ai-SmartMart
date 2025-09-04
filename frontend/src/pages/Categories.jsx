import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/products';
import { useAgent } from '../context/AgentContext';
import { 
  Grid3X3, 
  Search, 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  Book, 
  Headphones,
  ArrowRight,
  TrendingUp,
  Star,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/products/ProductCard';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { sendMessage, setIsOpen } = useAgent();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory || searchTerm) {
      loadProducts();
    }
  }, [selectedCategory, searchTerm]);

  const loadCategories = async () => {
    try {
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const productsData = await productService.getProducts({ ...params, limit: 20 });
      setProducts(productsData);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const handleAskAboutCategory = (category) => {
    setIsOpen(true);
    sendMessage(`Tell me about ${category} products. What are the best items in this category?`);
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Electronics': <Smartphone className="h-8 w-8" />,
      'Fashion': <Shirt className="h-8 w-8" />,
      'Home & Kitchen': <Home className="h-8 w-8" />,
      'Sports & Fitness': <Dumbbell className="h-8 w-8" />,
      'Books': <Book className="h-8 w-8" />,
      'Audio': <Headphones className="h-8 w-8" />
    };
    return iconMap[category] || <Grid3X3 className="h-8 w-8" />;
  };

  const getCategoryColor = (category, index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop by Category
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Discover amazing products organized by category. Find exactly what you're looking for with our AI shopping assistants.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search across all categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Grid */}
        {!selectedCategory && !searchTerm && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse Categories
              </h2>
              <p className="text-lg text-gray-600">
                Explore our wide range of product categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className={`bg-gradient-to-br ${getCategoryColor(category, index)} p-8 text-white relative`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full translate-y-6 -translate-x-6"></div>
                    
                    <div className="relative z-10">
                      <div className="text-white mb-4">
                        {getCategoryIcon(category)}
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{category}</h3>
                      
                      <p className="text-sm opacity-90 mb-4">
                        Explore our {category.toLowerCase()} collection
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          View Products
                        </span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Ask AI Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAskAboutCategory(category);
                    }}
                    className="absolute top-2 right-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
                    title="Ask AI about this category"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <Grid3X3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No categories available at the moment.</p>
              </div>
            )}
          </section>
        )}

        {/* Selected Category or Search Results */}
        {(selectedCategory || searchTerm) && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedCategory ? `${selectedCategory} Products` : `Search Results`}
                </h2>
                {selectedCategory && (
                  <p className="text-lg text-gray-600 mt-2">
                    Discover our best {selectedCategory.toLowerCase()} products
                  </p>
                )}
                {searchTerm && (
                  <p className="text-lg text-gray-600 mt-2">
                    Showing results for "{searchTerm}"
                  </p>
                )}
              </div>
              
              <div className="flex space-x-4">
                {selectedCategory && (
                  <button
                    onClick={() => handleAskAboutCategory(selectedCategory)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Ask AI for Recommendations
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  View All Categories
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory 
                    ? `No products available in ${selectedCategory} category.`
                    : `No products match your search "${searchTerm}".`
                  }
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchTerm('');
                  }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Browse All Categories
                </button>
              </div>
            )}
          </section>
        )}

        {/* Popular Categories Section */}
        {!selectedCategory && !searchTerm && categories.length > 0 && (
          <section className="mt-20">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Popular This Week
                </h2>
                <p className="text-lg text-gray-600">
                  Most browsed categories by our customers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.slice(0, 3).map((category, index) => (
                  <div key={category} className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${getCategoryColor(category, index)} rounded-full mb-4`}>
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category}</h3>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                      <Users className="h-4 w-4" />
                      <span>Trending</span>
                    </div>
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Browse {category} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Categories;