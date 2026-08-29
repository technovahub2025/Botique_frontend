import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import SectionHeading from '../ui/SectionHeading';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';
import api from '../../services/api';

const FeaturedCollection = () => {
  const { getSection } = useHomepageSettings();
  const featured = getSection('featured_collection');
  const [collection, setCollection] = useState(null);

  const collectionId = featured.collectionId;

  useEffect(() => {
    if (!collectionId) return;

    const fetchCollection = async () => {
      try {
        let res;
        const decoded = decodeURIComponent(collectionId).trim();
        res = await api.get(`/collections/${decoded}`);
        if (res.data.success && res.data.collection) {
          setCollection(res.data.collection);
        }
      } catch {
        try {
          const res2 = await api.get(`/collections/slug/${decodeURIComponent(collectionId)}`);
          if (res2.data.success && res2.data.collection) {
            setCollection(res2.data.collection);
          }
        } catch {
          setCollection(null);
        }
      }
    };
    fetchCollection();
  }, [collectionId]);

  const title = featured.title || collection?.name || 'The Monsoon Reverie';
  const subtitle = featured.subtitle || "Editor's selection";
  const imageUrl = collection?.heroImage || collection?.bannerImage || 'https://images.unsplash.com/photo-1612817153549-8885942493a7?auto=format&fit=crop&w=1920&q=80';
  const description = collection?.description || "A capsule collection of hand-block printed silhouettes in earthy indigos and muted golds, inspired by the monsoon season. Each piece is crafted by artisan cooperatives in Rajasthan.";
  const buttonText = featured.ctaText || 'Explore the Edit';
  const ctaLink = featured.ctaLink || `/shop${collection?.slug ? `?collection=${collection.slug}` : ''}`;

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          align="left"
        />

        <div className="mt-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-burgundy/5 to-transparent" />

          <div className="relative overflow-hidden bg-ivory">
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/1920x500/f8f4ec/999';
                }}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-8 left-8 md:left-12 text-ivory max-w-md">
              <h3 className="font-heading text-3xl md:text-4xl font-medium mb-3">
                {title}
              </h3>
              <p className="text-sm text-gray-200 mb-4 line-clamp-3">
                {description}
              </p>
              <Button variant="gold" size="sm">
                <Link to={ctaLink} className="flex items-center gap-1">
                  {buttonText}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
