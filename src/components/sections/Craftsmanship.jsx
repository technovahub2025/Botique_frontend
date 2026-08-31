import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';
import { getImageUrl } from '../../services/imageUrl';

const DEFAULT_CRAFTSMANSHIP = {
  title: 'The Art Of Timeless Making',
  description: "At Loom & Luster, every garment begins with a single thread — carefully sourced from heritage farms and woven on traditional handlooms by artisans whose families have practiced the craft for generations. Our pieces are not made to be worn once; they are made to be treasured, passed down, and cherished for decades.",
  imageUrl: 'https://images.unsplash.com/photo-1587614296097-6f7c9a081b32?auto=format&fit=crop&w=800&q=80',
};

const Craftsmanship = () => {
  const { getSection } = useHomepageSettings();
  const craft = { ...DEFAULT_CRAFTSMANSHIP, ...getSection('craftsmanship') };

  return (
    <section className="py-16 lg:py-24 bg-ivory">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              title={craft.title}
              subtitle="Our craft"
              align="left"
              goldAccent={false}
            />

            <p className="text-gray-600 leading-relaxed mt-6">
              {craft.description}
            </p>

            <p className="text-gray-600 leading-relaxed mt-4">
              We partner with cooperatives across Tamil Nadu, Rajasthan, and West Bengal, ensuring fair wages and preserving age-old techniques like hand-block printing, zari work, and natural dyeing. When you wear a Loom &amp; Luster piece, you carry forward a legacy of craftsmanship.
            </p>

            <div className="mt-8">
              <Button variant="secondary" size="md">
                <Link to="/about">Our Craftsmanship</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden bg-cream">
                <img
                  src={getImageUrl(craft.imageUrl)}
                  alt="Artisan at work"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/800x1000/f8f4ec/999?text=Artisan+Craftsmanship';
                  }}
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-cream p-6 max-w-xs">
                <p className="font-heading text-burgundy text-sm uppercase tracking-widest">
                  Handwoven in India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Craftsmanship;
