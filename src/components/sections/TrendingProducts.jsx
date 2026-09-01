import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toArray } from '../../utils';
import ProductCard from '../ui/ProductCard';
import SectionHeading from '../ui/SectionHeading';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getSection } = useHomepageSettings();
  const trending = getSection('trending');
  const limit = trending.limit || 8;

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?limit=${limit}&sortBy=createdAt&order=desc&bestSeller=true`);
         setProducts(toArray(res.data, ['products']));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [limit]);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={trending.title || 'Trending Now'}
          subtitle={trending.subtitle || 'As loved by our community'}
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            Trending pieces are being woven as we speak. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
