import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search,
  Filter,
  Calendar,
  Eye,
  MessageCircle,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useAgent } from '../../context/AgentContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { user } = useAuth();
  const { checkOrderStatus } = useAgent();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Mock API call - replace with actual API endpoint
      const mockOrders = [
        {
          id: 1001,
          status: 'delivered',
          total_amount: 1298.00,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-18T16:45:00Z',
          tracking_number: '1Z999AA1234567890',
          order_items: [
            {
              id: 1,
              quantity: 1,
              price: 999.00,
              product: {
                id: 1,
                name: 'iPhone 15 Pro',
                image_url: 'https://via.placeholder.com/80x80?text=iPhone',
                category: 'Electronics'
              }
            },
            {
              id: 2,
              quantity: 1,
              price: 299.00,
              product: {
                id: 2,
                name: 'AirPods Pro (2nd Gen)',
                image_url: 'https://via.placeholder.com/80x80?text=AirPods',
                category: 'Electronics'
              }
            }
          ]
        },
        {
          id: 1002,
          status: 'shipped',
          total_amount: 89.99,
          created_at: '2024-01-20T14:22:00Z',
          updated_at: '2024-01-22T09:15:00Z',
          tracking_number: '1Z999BB9876543210',
          order_items: [
            {
              id: 3,
              quantity: 1,
              price: 89.99,
              product: {
                id: 3,
                name: 'Wireless Bluetooth Headphones',
                image_url: 'https://via.placeholder.com/80x80?text=Headphones',
                category: 'Electronics'
              }
            }
          ]
        },
        {
          id: 1003,
          status: 'processing',
          total_amount: 245.50,
          created_at: '2024-01-25T11:45:00Z',
          updated_at: '2024-01-25T11:45:00Z',
          tracking_number: null,
          order_items: [
            {
              id: 4,
              quantity: 2,
              price: 122.75,
              product: {
                id: 4,
                name: 'Smart Fitness Watch',
                image_url: 'https://via.placeholder.com/80x80?text=Watch',
                category: 'Electronics'
              }
            }
          ]
        },
        {
          id: 1004,
          status: 'pending',
          total_amount: 156.00,
          created_at: '2024-01-28T16:30:00Z',
          updated_at: '2024-01-28T16:30:00Z',
          tracking_number: null,
          order_items: [
            {
              id: 5,
              quantity: 3,
              price: 52.00,
              product: {
                id: 5,
                name: 'Organic Coffee Beans',
                image_url: 'https://via.placeholder.com/80x80?text=Coffee',
                category: 'Food & Beverage'
              }
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      toast.error('Failed to load order history');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleAITrack = async (orderId) => {
    try {
      await checkOrderStatus(orderId);
      toast.success('AI assistant will help you track this order!');
    } catch (error) {
      toast.error('Failed to start AI tracking');
    }
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchTerm) ||
                         order.order_items.some(item => 
                           item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        case '3months':
          return daysDiff <= 90;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'amount_high':
        return b.total_amount - a.total_amount;
      case 'amount_low':
        return a.total_amount - b.total_amount;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-600">
            Welcome back, {user?.first_name || user?.username}! Here are your recent orders.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="3months">Last 3 Months</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Highest Amount</option>
                <option value="amount_low">Lowest Amount</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === 'shipped').length}
              </p>
              <p className="text-sm text-gray-600">In Transit</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : "Try adjusting your search or filter criteria."}
            </p>
            {orders.length === 0 && (
              <Link
                to="/shop"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                <Package className="h-4 w-4 mr-2" />
                Start Shopping
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-0 flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="font-semibold text-primary-600">
                        ${order.total_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Product Images */}
                      <div className="flex -space-x-2">
                        {order.order_items.slice(0, 3).map((item, index) => (
                          <img
                            key={item.id}
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg border-2 border-white object-cover"
                            style={{ zIndex: 3 - index }}
                          />
                        ))}
                        {order.order_items.length > 3 && (
                          <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                            +{order.order_items.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.order_items.length === 1 
                            ? order.order_items[0].product.name
                            : `${order.order_items[0].product.name} and ${order.order_items.length - 1} more item${order.order_items.length > 2 ? 's' : ''}`
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} item{order.order_items.length !== 1 ? 's' : ''}
                          {order.tracking_number && (
                            <span className="ml-2">• Tracking: {order.tracking_number}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleAITrack(order.id)}
                        className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Track with AI Assistant"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        AI Track
                      </button>
                      
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Progress Bar (for shipped/delivered orders) */}
                  {(order.status === 'shipped' || order.status === 'delivered') && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Order Progress</span>
                        <span>{order.status === 'delivered' ? 'Delivered' : 'In Transit'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ 
                            width: order.status === 'delivered' ? '100%' : '75%' 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      {order.status === 'delivered' && (
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                          Write Review
                        </button>
                      )}
                      {(order.status === 'delivered' || order.status === 'shipped') && (
                        <button className="text-gray-600 hover:text-gray-700">
                          Return Items
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-700">
                        Reorder
                      </button>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <span>Last updated: {formatDate(order.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if pagination needed) */}
        {sortedOrders.length > 0 && sortedOrders.length >= 10 && (
          <div className="text-center mt-8">
            <button 
              onClick={() => toast.info('Load more functionality would be implemented here')}
              className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Load More Orders
            </button>
          </div>
        )}

        {/* AI Assistant Promotion */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                Need Help with Your Orders?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Our AI assistants are here to help with tracking, returns, and any questions about your orders.
              </p>
            </div>
            
            <button
              onClick={() => toast.success('AI chat will open to help with your orders!')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
               