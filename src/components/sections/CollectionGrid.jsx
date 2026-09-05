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
  const trackRef = useRef(null);

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
    const track = trackRef.current;
    if (!track) return;
    setShowLeft(track.scrollLeft > 10);
    setShowRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 10);
  };

  const getCardScrollAmount = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const firstCard = track.querySelector('[data-carousel-card]');
    if (!firstCard) return 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 24; // gap-6 = 1.5rem = 24px
    return cardWidth + gap;
  };

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const scrollAmount = getCardScrollAmount();
    track.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    checkScroll();
    track.addEventListener('scroll', checkScroll);
    return () => track.removeEventListener('scroll', checkScroll);
  }, [displayCollections, loading]);

  const scrollbarHideStyle = {
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const scrollbarHidePseudoStyle = `
    #collection-carousel-track::-webkit-scrollbar { display: none; }
  `;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Collections"
          subtitle="Bespoke groupings of our finest pieces"
        />

        {loading ? (
          <div className="flex gap-6 overflow-x-auto" style={scrollbarHideStyle}>
            <style>{scrollbarHidePseudoStyle}</style>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[240px] max-w-[240px] aspect-[3/4] bg-cream animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="relative -mx-4 px-4">
            <div
              id="collection-carousel-track"
              ref={trackRef}
              className="flex gap-6 overflow-x-auto scroll-px-0"
              style={scrollbarHideStyle}
            >
              <style>{scrollbarHidePseudoStyle}</style>
              {displayCollections.map((collection) => (
                <div
                  key={collection._id || collection.id}
                  data-carousel-card
                  className="min-w-[240px] max-w-[240px] sm:min-w-[calc(50%-12px)] sm:max-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] lg:max-w-[calc(33.333%-16px)]"
                >
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
