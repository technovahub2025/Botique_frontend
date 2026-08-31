import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { formatPrice, getEffectivePrice, calculateDiscount } from '../utils';
import { getImageUrl } from '../services/imageUrl';

const Wishlist = () => {
  const { items, removeItem, toggleWishlist, moveToCart, clearWishlist } = useWishlist();

  const handleMoveToCart = async (product) => {
    try {
      const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
      await moveToCart(product, 1, size);
    } catch (err) {
      console.error('Move to cart failed:', err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center fade-in">
        <h2 className="text-2xl font-heading font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">Save items you love to your wishlist!</p>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold">My Wishlist</h1>
        <button
          onClick={clearWishlist}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => {
          const price = getEffectivePrice(product.price, product.salePrice);
          const discount = calculateDiscount(product.price, product.salePrice);
          const imageSrc =
            product.images && product.images.length > 0
              ? getImageUrl(product.images[0])
              : 'https://placehold.co/600x800/eee/999?text=No+Image';
          const liked = true;

          return (
            <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden group">
              <Link to={`/product/${product.slug || product._id}`} className="block">
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="max-w-full max-h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x800/eee/999?text=No+Image';
                    }}
                  />
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-charcoal group-hover:text-burgundy transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="mt-1">
                  {discount > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-burgundy">{formatPrice(price)}</span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-burgundy font-medium">{discount}% off</span>
                    </div>
                  ) : (
                    <span className="font-medium text-charcoal">{formatPrice(product.price)}</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1 bg-charcoal text-ivory py-2 rounded text-sm font-medium hover:bg-deep-brown transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeItem(product._id)}
                    className="flex-1 flex items-center justify-center gap-1 border border-gray-300 text-charcoal py-2 rounded text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded border transition-all ${
                      liked
                        ? 'border-burgundy text-burgundy'
                        : 'border-gray-300 text-charcoal hover:border-burgundy hover:text-burgundy'
                    }`}
                    title="Remove from wishlist"
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
