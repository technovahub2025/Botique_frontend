import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice, getEffectivePrice } from '../utils';

const Cart = () => {
   const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    shipping,
    tax,
    totalPrice,
    loading,
    updatingIds,
    error,
    clearError,
  } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add some beautiful pieces to get started.</p>
        <Link
          to="/shop"
          className="inline-block bg-charcoal text-ivory px-6 py-3 rounded-md font-medium hover:bg-deep-brown transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-2xl font-heading font-bold mb-6">Shopping Cart</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900 font-medium text-sm">
            ×
          </button>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          const { product, quantity, selectedSize, selectedColor } = item;
          const price = getEffectivePrice(item.price, item.salePrice);
          const itemTotal = price * quantity;

          if (!product) {
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-500">Product unavailable</h3>
                  <p className="text-sm text-gray-500">This product has been removed.</p>
                </div>
                <span className="w-20 text-right font-semibold">{formatPrice(itemTotal)}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="max-w-full max-h-full object-cover rounded"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                {selectedSize && <p className="text-sm text-gray-500">Size: {selectedSize}</p>}
                {selectedColor && <p className="text-sm text-gray-500">Color: {selectedColor}</p>}
                <p className="text-burgundy font-semibold">{formatPrice(price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, Math.max(1, quantity - 1))}
                  disabled={updatingIds.has(item.id)}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-2">{quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  disabled={updatingIds.has(item.id)}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="w-20 text-right font-semibold">{formatPrice(itemTotal)}</span>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={updatingIds.has(item.id)}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t pt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {formatPrice(shipping)}
            {shipping === 0 && subtotal > 0 && (
              <span className="text-xs text-burgundy ml-2">(Free)</span>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tax (12%)</span>
          <span className="font-semibold">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between items-center border-t pt-3 mb-6">
          <span className="text-xl font-bold">Total</span>
          <span className="text-2xl font-bold text-charcoal">{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={clearCart}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            Clear Cart
          </button>
          <Link
            to="/checkout"
            className="flex-1 bg-charcoal text-ivory py-2 rounded font-medium hover:bg-deep-brown text-center transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
