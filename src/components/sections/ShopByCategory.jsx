import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toArray } from '../../utils';
import CategoryCard from '../ui/CategoryCard';
import SectionHeading from '../ui/SectionHeading';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const containerRef = useRef(null);
  const { getSection } = useHomepageSettings();
  const section = getSection('shop_by_category');
  const title = section.title || 'Shop By Category';
  const subtitle = section.subtitle || 'Curated by silhouette';

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get('/categories?status=active');
        setCategories(toArray(res.data, ['categories']));
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    setShowLeft(container.scrollLeft > 10);
    setShowRight(container.scrollLeft + container.clientWidth < container.scrollWidth - 10);
  };

  const scroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;
    const cardWidth = 240 + 24; // card width + gap-6 (1.5rem = 24px)
    const scrollAmount = cardWidth * (direction === 'left' ? -1 : 1);
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    checkScroll();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    checkScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categories, loading]);

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className="flex gap-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[240px] max-w-[240px] aspect-[3/4] bg-cream animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-12 lg:py-16 bg-ivory">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading title={title} subtitle={subtitle} />
          <p className="text-center text-gray-500 mt-8">Categories coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-ivory">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="relative -mx-4 px-4">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-px-0"
          >
            {categories.map((category) => (
              <div key={category._id} className="min-w-[240px] max-w-[240px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] lg:max-w-[calc(33.333%-16px)]">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
          {showLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute top-1/2 -translate-y-1/2 left-2 z-10 p-2 text-charcoal hover:text-burgundy border border-gray-300 rounded-full transition-colors bg-white shadow-subtle"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {showRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute top-1/2 -translate-y-1/2 right-2 z-10 p-2 text-charcoal hover:text-burgundy border border-gray-300 rounded-full transition-colors bg-white shadow-subtle"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
