import React from 'react';
import { Loader2, ShoppingBag, Bot } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  type = 'default', 
  message = '', 
  className = '',
  fullScreen = false 
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  // Different loading animations based on type
  const renderSpinner = () => {
    switch (type) {
      case 'shopping':
        return (
          <div className="relative">
            <ShoppingBag className={`${sizeClasses[size]} text-primary-600 animate-bounce`} />
            <div className="absolute -top-1 -right-1">
              <div className="h-3 w-3 bg-primary-600 rounded-full animate-ping"></div>
            </div>
          </div>
        );
      
      case 'ai':
        return (
          <div className="relative">
            <Bot className={`${sizeClasses[size]} text-primary-600 animate-pulse`} />
            <div className="absolute inset-0 border-2 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-primary-600 rounded-full animate-pulse`}></div>
        );
      
      case 'ring':
        return (
          <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-6 bg-primary-600 rounded animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-8 bg-primary-600 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-6 bg-primary-600 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-8 bg-primary-600 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1 h-6 bg-primary-600 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        );
      
      default:
        return (
          <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
        );
    }
  };

  // Loading messages based on context
  const getLoadingMessage = () => {
    if (message) return message;
    
    switch (type) {
      case 'shopping':
        return 'Loading products...';
      case 'ai':
        return 'AI is thinking...';
      default:
        return 'Loading...';
    }
  };

  // Base container classes
  const containerClasses = `
    flex flex-col items-center justify-center space-y-3
    ${fullScreen ? 'min-h-screen bg-white/80 backdrop-blur-sm fixed inset-0 z-50' : ''}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {/* Spinner */}
      <div className="flex items-center justify-center">
        {renderSpinner()}
      </div>
      
      {/* Loading Message */}
      {(message || type === 'shopping' || type === 'ai') && (
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">
            {getLoadingMessage()}
          </p>
          {type === 'ai' && (
            <p className="text-xs text-gray-400 mt-1">
              This may take a few seconds...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Specialized loading components for common use cases
export const PageLoader = ({ message = 'Loading page...' }) => (
  <LoadingSpinner 
    size="lg" 
    type="default" 
    message={message}
    fullScreen={true}
  />
);

export const ProductLoader = () => (
  <LoadingSpinner 
    size="md" 
    type="shopping" 
    message="Loading products..."
    className="py-12"
  />
);

export const AIThinkingLoader = () => (
  <LoadingSpinner 
    size="sm" 
    type="ai" 
    message="AI is processing..."
    className="p-2"
  />
);

export const ButtonLoader = ({ size = 'sm' }) => (
  <LoadingSpinner 
    size={size} 
    type="default" 
    className="inline-flex"
  />
);

export const InlineLoader = () => (
  <LoadingSpinner 
    size="sm" 
    type="dots" 
    className="inline-flex"
  />
);

// Card skeleton loader
export const CardSkeleton = ({ count = 1 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSpinner;