import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { formatPrice, getEffectivePrice, calculateDiscount } from '../../utils';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const price = getEffectivePrice(product.price, product.salePrice);
  const discount = calculateDiscount(product.price, product.salePrice);
  const liked = isInWishlist(product._id);
  const inStock = product.stock > 0;

  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://placehold.co/600x800/eee/999?text=No+Image';

  const handleQuickView = (e) => {
    e.preventDefault();
    navigate(`/product/${product.slug || product._id}`);
  };

  const handleAddToBag = (e) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <Link to={`/product/${product.slug || product._id}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x800/eee/999?text=No+Image';
            }}
          />
        </div>

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-burgundy text-ivory text-xs font-medium px-2 py-1 uppercase tracking-wider">
            {discount}% off
          </span>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleWishlist}
            className={`p-1.5 rounded-full bg-ivory/90 backdrop-blur transition-all ${
              liked
                ? 'text-burgundy'
                : 'text-charcoal hover:bg-charcoal hover:text-ivory'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="p-1.5 rounded-full bg-ivory/90 text-charcoal hover:bg-charcoal hover:text-ivory transition-all opacity-0 group-hover:opacity-100"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {inStock && (
            <button
              onClick={handleAddToBag}
              className="p-1.5 rounded-full bg-ivory/90 text-charcoal hover:bg-charcoal hover:text-ivory transition-all opacity-0 group-hover:opacity-100"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!inStock && (
          <span className="absolute bottom-3 left-3 text-xs text-burgundy font-medium">
            Sold Out
          </span>
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-medium text-sm text-charcoal group-hover:text-burgundy transition-colors line-clamp-1">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {product.category.name}
          </p>
        )}
        <div className="mt-1">
          {discount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-burgundy">{formatPrice(price)}</span>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            </div>
          ) : (
            <span className="font-medium text-sm text-charcoal">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
