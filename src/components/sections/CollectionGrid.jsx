import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toArray } from '../../utils';
import SectionHeading from '../ui/SectionHeading';
import CollectionCard from '../ui/CollectionCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CollectionGrid = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const res = await api.get('/collections?status=active');
        setCollections(toArray(res.data, ['collections']));
      } catch {
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const fallbackCollections = [
    { id: 'craft', name: 'Artisan Craft', slug: 'artisan-craft', description: 'Handcrafted by master artisans.' },
    { id: 'festive', name: 'Festive 2026', slug: 'festive-2026', description: 'Celebrate in style.' },
    { id: 'bridal', name: 'Bridal Edit', slug: 'bridal-edit', description: 'For your most precious moments.' },
  ];

  const displayCollections = collections.length > 0 ? collections : fallbackCollections;

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
  }, [displayCollections, loading]);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Collections"
          subtitle="Bespoke groupings of our finest pieces"
        />

        {loading ? (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[240px] max-w-[240px] aspect-[3/4] bg-cream animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="relative -mx-4 px-4">
            <div
              ref={containerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-px-0"
            >
              {displayCollections.map((collection) => (
                <div key={collection._id || collection.id} className="min-w-[240px] max-w-[240px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] lg:max-w-[calc(33.333%-16px)]">
                  <CollectionCard
                    collection={{
                      ...collection,
                      _id: collection._id || collection.id,
                    }}
                    size="medium"
                  />
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
        )}
      </div>
    </section>
  );
};

export default CollectionGrid;
