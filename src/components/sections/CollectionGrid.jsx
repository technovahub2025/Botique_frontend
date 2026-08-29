import { useState, useEffect } from 'react';
import api from '../../services/api';
import SectionHeading from '../ui/SectionHeading';
import CollectionCard from '../ui/CollectionCard';

const CollectionGrid = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const res = await api.get('/collections?status=active');
        setCollections(res.data.collections || []);
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

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Collections"
          subtitle="Bespoke groupings of our finest pieces"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {displayCollections.map((collection) => (
              <CollectionCard
                key={collection._id || collection.id}
                collection={{
                  ...collection,
                  _id: collection._id || collection.id,
                }}
                size="medium"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionGrid;
