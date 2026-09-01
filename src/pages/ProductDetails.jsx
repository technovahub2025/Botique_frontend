import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { formatPrice, getEffectivePrice, calculateDiscount, toArray } from '../utils';
import { getImageUrl } from '../services/imageUrl';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import Accordion from '../components/ui/Accordion';
import ProductCard from '../components/ui/ProductCard';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data.product);
        if (res.data.product.colors?.length > 0) {
          setSelectedColor(res.data.product.colors[0]);
        }
        if (res.data.product.sizes?.length > 0) {
          setSelectedSize(res.data.product.sizes[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category?.slug) return;
      setRelatedLoading(true);
      try {
        const res = await api.get(
          `/products?category=${product.category.slug}&limit=4&status=active`
        );
        setRelatedProducts(
          toArray(res.data, ['products']).filter((p) => p._id !== product._id)
        );
      } catch {
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    if (product) {
      fetchRelated();
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-4 lg:gap-8">
            <div className="lg:col-start-1">
              <div className="flex lg:flex-col gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-20 lg:w-20 lg:h-24 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
            <div className="lg:col-start-2">
              <div className="aspect-[3/4] bg-gray-200 rounded" />
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center fade-in">
        <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          to="/shop"
          className="inline-block bg-charcoal text-ivory px-6 py-3 rounded-md font-medium hover:bg-deep-brown transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const effectivePrice = getEffectivePrice(product.price, product.salePrice);
  const discount = calculateDiscount(product.price, product.salePrice);
  const productImages = toArray(product.images);
  const currentImage = productImages[selectedImage] || productImages[0];
  const inStock = product.stock > 0;
  const liked = isInWishlist(product._id);

  const handleAddToBag = () => {
    addItem(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedSize);
    navigate('/checkout');
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const accordionItems = [
    {
      title: 'Description',
      content: product.description || 'No description available.',
    },
    {
      title: 'Fabric',
      content: product.fabric || 'Premium handloom fabric, carefully sourced from heritage cooperatives.',
    },
    {
      title: 'Craft',
      content: product.material || 'Handwoven using traditional techniques passed down through generations.',
    },
    {
      title: 'Care',
      content: product.care || 'Dry clean only. Store folded in a cool, dry place. Iron on low heat if needed.',
    },
    {
      title: 'Shipping',
      content: 'We offer complimentary express shipping on orders above ₹5,000. Standard delivery within India takes 3-5 business days. International shipping is available for select destinations.',
    },
    {
      title: 'Returns',
      content: 'We accept returns within 7 days of delivery for unworn, unwashed items with original tags attached. Refunds are processed within 5-7 business days to the original payment method. Customised or sale items are final sale.',
    },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 fade-in">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-burgundy">Home</Link>
        {product.category && (
          <>
            <span className="mx-1">/</span>
            <Link to={`/category/${product.category.slug}`} className="hover:text-burgundy">
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-1">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      {/* Gallery + Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-4 lg:gap-8">
        {/* Thumbnails: horizontal scroll on mobile, vertical sidebar on desktop */}
        {productImages.length > 1 && (
          <div className="lg:col-start-1">
            <div className="flex overflow-x-auto lg:flex-col lg:overflow-y-auto gap-2 lg:gap-3 pb-1 lg:pb-0 lg:max-h-[600px]">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 lg:w-20 lg:h-24 flex-shrink-0 overflow-hidden border-2 transition-all rounded ${
                    idx === selectedImage
                      ? 'border-charcoal'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        'https://placehold.co/800x1000/eee/999?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Image: top on mobile, right column on desktop */}
        <div className="relative lg:col-start-2">
          <div className="aspect-[3/4] overflow-hidden bg-cream">
            <img
              src={getImageUrl(currentImage)}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-opacity duration-300"
              onLoad={(e) => { e.target.classList.add('image-loaded'); }}
              onError={(e) => {
                e.target.src =
                  'https://placehold.co/800x1000/eee/999?text=No+Image';
              }}
            />
          </div>

          {productImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-ivory/90 text-charcoal hover:bg-ivory rounded transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-ivory/90 text-charcoal hover:bg-ivory rounded transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 lg:col-start-2">
          <h1 className="font-heading text-2xl text-charcoal">{product.name}</h1>

          {product.shortDescription && (
            <p className="text-sm text-gray-500">{product.shortDescription}</p>
          )}

          <div>
            {discount > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-medium text-burgundy">
                  {formatPrice(effectivePrice)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-burgundy font-medium">
                  Save {discount}%
                </span>
              </div>
            ) : (
              <span className="text-2xl font-medium text-charcoal">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.sku && (
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-charcoal mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const colorMap = {
                    red: '#dc2626',
                    blue: '#2563eb',
                    green: '#16a34a',
                    yellow: '#ca8a04',
                    black: '#111827',
                    white: '#f9fafb',
                    pink: '#db2777',
                    purple: '#7c3aed',
                    gold: '#d4af37',
                    silver: '#9ca3af',
                    navy: '#1e3a8a',
                    grey: '#6b7280',
                    gray: '#6b7280',
                    cream: '#fef3c7',
                    beige: '#d2b48c',
                    maroon: '#7a2828',
                    burgundy: '#7a4d5c',
                  };
                  const bg =
                    colorMap[color.toLowerCase()] ||
                    color.toLowerCase();
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? 'border-charcoal ring-2 ring-gold-light'
                          : 'border-gray-300 hover:border-charcoal'
                      }`}
                      style={{ backgroundColor: bg }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-charcoal mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-charcoal bg-charcoal text-ivory'
                        : 'border-gray-300 text-charcoal hover:border-charcoal hover:bg-ivory'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-medium text-sm text-charcoal mb-2">Quantity</h3>
            <div className="flex items-center w-32 border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-charcoal hover:bg-cream rounded-l-md transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-charcoal hover:bg-cream rounded-r-md transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToBag}
              disabled={!inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-md transition-all ${
                inStock
                  ? 'bg-charcoal text-ivory hover:bg-deep-brown'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? 'Add to Bag' : 'Out of Stock'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 border rounded-md transition-all ${
                liked
                  ? 'border-burgundy bg-burgundy text-ivory'
                  : 'border-gray-300 text-charcoal hover:border-burgundy hover:text-burgundy'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {inStock && (
            <button
              onClick={handleBuyNow}
              className="w-full py-3 text-sm font-medium text-center text-charcoal border border-charcoal rounded-md hover:bg-charcoal hover:text-ivory transition-all"
            >
              Buy Now
            </button>
          )}

          <p className="text-xs text-gray-500 pt-2">
            {inStock
              ? `${product.stock} item${product.stock !== 1 ? 's' : ''} in stock`
              : 'Currently unavailable'}
          </p>
        </div>
      </div>

      {/* Accordions */}
      <div className="mt-12 lg:mt-16">
        <Accordion items={accordionItems} defaultOpen={[0]} />
      </div>

      {/* Related Products */}
      <div className="mt-12 lg:mt-16">
        <h2 className="font-heading text-2xl text-charcoal mb-6">
          You May Also Like
        </h2>
        {relatedLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
            ))}
          </div>
        ) : relatedProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No related products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                product={relatedProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
