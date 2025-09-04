import React, { useState, useEffect } from 'react';
import { useAgent } from '../context/AgentContext';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  MessageCircle,
  Search,
  Filter,
  Calendar,
  Download,
  RotateCcw,
  MapPin,
  CreditCard,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const Orders = () => {
  const { checkOrderStatus, sendMessage, setIsOpen } = useAgent();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 12345,
        date: '2024-01-15',
        status: 'delivered',
        total: 1398.00,
        items: 2,
        trackingNumber: '1Z999AA1234567890',
        estimatedDelivery: '2024-01-18',
        actualDelivery: '2024-01-17',
        paymentMethod: 'Credit Card ending in 4242',
        shippingAddress: '123 Main St, Anytown, USA 12345',
        products: [
          {
            id: 1,
            name: 'iPhone 15 Pro',
            price: 999.00,
            quantity: 1,
            image: '/api/placeholder/80/80'
          },
          {
            id: 2,
            name: 'Sony WH-1000XM5',
            price: 399.00,
            quantity: 1,
            image: '/api/placeholder/80/80'
          }
        ]
      },
      {
        id: 12346,
        date: '2024-01-20',
        status: 'shipped',
        total: 799.00,
        items: 1,
        trackingNumber: '1Z999AA1234567891',
        estimatedDelivery: '2024-01-25',
        paymentMethod: 'Credit Card ending in 4242',
        shippingAddress: '123 Main St, Anytown, USA 12345',
        products: [
          {
            id: 3,
            name: 'MacBook Air M3',
            price: 799.00,
            quantity: 1,
            image: '/api/placeholder/80/80'
          }
        ]
      },
      {
        id: 12347,
        date: '2024-01-22',
        status: 'processing',
        total: 450.00,
        items: 3,
        estimatedDelivery: '2024-01-28',
        paymentMethod: 'Credit Card ending in 4242',
        shippingAddress: '123 Main St, Anytown, USA 12345',
        products: [
          {
            id: 4,
            name: 'Nike Air Max 270',
            price: 150.00,
            quantity: 2,
            image: '/api/placeholder/80/80'
          },
          {
            id: 5,
            name: 'Yoga Mat Premium',
            price: 45.00,
            quantity: 1,
            image: '/api/placeholder/80/80'
          }
        ]
      },
      {
        id: 12348,
        date: '2024-01-25',
        status: 'cancelled',
        total: 299.00,
        items: 1,
        paymentMethod: 'Credit Card ending in 4242',
        products: [
          {
            id: 6,
            name: 'Coffee Maker Pro',
            price: 299.00,
            quantity: 1,
            image: '/api/placeholder/80/80'
          }
        ]
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', completed: true },
      { key: 'processing', label: 'Processing', completed: status !== 'cancelled' },
      { key: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(status) },
      { key: 'delivered', label: 'Delivered', completed: status === 'delivered' }
    ];

    if (status === 'cancelled') {
      return [
        { key: 'confirmed', label: 'Order Confirmed', completed: true },
        { key: 'cancelled', label: 'Cancelled', completed: true, error: true }
      ];
    }

    return steps;
  };

  const filteredOrders = orders
    .filter(order => {
      if (filter === 'all') return true;
      return order.status === filter;
    })
    .filter(order => {
      if (!searchTerm) return true;
      return order.id.toString().includes(searchTerm) ||
             order.products.some(product => 
               product.name.toLowerCase().includes(searchTerm.toLowerCase())
             );
    });

  const handleTrackOrder = (order) => {
    if (order.trackingNumber) {
      checkOrderStatus(order.id);
    } else {
      toast.info('Tracking information will be available once the order ships');
    }
  };

  const handleAskAboutOrder = (order) => {
    setIsOpen(true);
    sendMessage(`I have a question about my order #${order.id} (${order.status}). Can you help me with tracking and details?`);
  };

  const handleReorder = (order) => {
    toast.success('Items added to cart for reordering!');
  };

  const handleDownloadInvoice = (order) => {
    toast.success(`Invoice for order #${order.id} downloaded!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600">{orders.length} orders found</p>
          </div>
          
          <button
            onClick={() => {
              setIsOpen(true);
              sendMessage("I need help with my orders. Can you help me track my purchases or answer questions about my order history?");
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask AI About Orders
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search criteria' : 'You haven\'t placed any orders yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                          <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleAskAboutOrder(order)}
                          className="p-1 text-gray-600 hover:text-primary-600 rounded"
                          title="Ask AI about this order"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="p-1 text-gray-600 hover:text-primary-600 rounded"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="p-1 text-gray-600 hover:text-primary-600 rounded"
                            title="Reorder items"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="p-1 text-gray-600 hover:text-primary-600 rounded"
                          title="Download invoice"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {product.quantity} × ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.products.length > 3 && (
                      <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">
                          +{order.products.length - 3} more items
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                    {order.trackingNumber && (
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </button>
                    )}
                    
                    {order.status === 'delivered' && (
                      <button className="flex items-center px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                        <Star className="h-4 w-4 mr-2" />
                        Write Review
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleAskAboutOrder(order)}
                      className="flex items-center px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Ask AI
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {selectedOrder === order.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Order Progress */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Order Progress</h4>
                        <div className="space-y-4">
                          {getStatusSteps(order.status).map((step, index) => (
                            <div key={step.key} className="flex items-center">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                step.completed 
                                  ? step.error 
                                    ? 'bg-red-100 border-red-500 text-red-600'
                                    : 'bg-green-100 border-green-500 text-green-600'
                                  : 'bg-gray-100 border-gray-300 text-gray-400'
                              }`}>
                                {step.completed ? (
                                  step.error ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div className="ml-4">
                                <p className={`text-sm font-medium ${
                                  step.completed ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {step.label}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tracking Info */}
                        {order.trackingNumber && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                                <p className="text-sm text-blue-700 font-mono">{order.trackingNumber}</p>
                              </div>
                              <button
                                onClick={() => handleTrackOrder(order)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Truck className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Order Details</h4>
                        <div className="space-y-4">
                          {/* Shipping Address */}
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                              <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div className="flex items-start space-x-3">
                            <CreditCard className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Payment Method</p>
                              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                            </div>
                          </div>

                          {/* Delivery Info */}
                          {order.estimatedDelivery && (
                            <div className="flex items-start space-x-3">
                              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {order.status === 'delivered' ? 'Delivered' : 'Expected Delivery'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.actualDelivery 
                                    ? new Date(order.actualDelivery).toLocaleDateString()
                                    : new Date(order.estimatedDelivery).toLocaleDateString()
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* All Items */}
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-900 mb-3">Items Ordered</h5>
                          <div className="space-y-3">
                            {order.products.map((product) => (
                              <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-600">Qty: {product.quantity}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  ${(product.price * product.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Order Statistics */}
        {orders.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {orders.filter(o => ['processing', 'shipped'].includes(o.status)).length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;