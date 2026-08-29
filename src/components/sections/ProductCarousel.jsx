import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../ui/ProductCard';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCarousel = ({ title, subtitle, apiParams, showHeading = true }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', { params: apiParams });
        setProducts(res.data.products || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [apiParams]);

  const scroll = (direction) => {
    const container = document.getElementById(`carousel-${title.replace(/\s+/g, '-')}`);
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const carouselId = `carousel-${title.replace(/\s+/g, '-')}`;

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {showHeading && (
          <div className="flex items-center justify-between mb-8">
            <SectionHeading title={title} subtitle={subtitle} align="left" />
            {products.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="p-2 text-charcoal hover:text-burgundy border border-gray-300 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="p-2 text-charcoal hover:text-burgundy border border-gray-300 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-gray-500 text-sm">Unable to load products at this time.</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm">No products available yet. Check back soon.</p>
        ) : (
          <div
            id={carouselId}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
          >
            {products.map((product) => (
              <div key={product._id} className="min-w-[240px] max-w-[240px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!showHeading && products.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="secondary" size="sm">
              <Link to="/shop">View All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;
