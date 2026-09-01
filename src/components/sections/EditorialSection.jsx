import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import SectionHeading from '../ui/SectionHeading';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';
import { getImageUrl } from '../../services/imageUrl';

const DEFAULT_EDITORIAL = {
  title: 'The Art of Handweaving',
  subtitle: "Editor's selection",
  content:
    "Editorial content...",
  imageUrl: 'https://images.unsplash.com/photo-1587614296097-6f7c9a081b32?auto=format&fit=crop&w=1920&q=80',
  linkUrl: '/story',
  buttonText: 'Read the Story',
};

const EditorialSection = () => {
  const { getSection } = useHomepageSettings();
  const editorial = { ...DEFAULT_EDITORIAL, ...getSection('editorial') };

  const title = editorial.title || DEFAULT_EDITORIAL.title;
  const subtitle = editorial.subtitle || DEFAULT_EDITORIAL.subtitle;
  const content = editorial.content || DEFAULT_EDITORIAL.content;
  const imageUrl = getImageUrl(editorial.imageUrl) || DEFAULT_EDITORIAL.imageUrl;
  const buttonText = editorial.buttonText || DEFAULT_EDITORIAL.buttonText;
  const linkUrl = editorial.linkUrl || DEFAULT_EDITORIAL.linkUrl;

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              title={title}
              subtitle={subtitle}
              align="left"
              goldAccent={false}
            />

            <p className="text-gray-600 leading-relaxed mt-6">
              {content}
            </p>

            <div className="mt-8">
              <Button variant="secondary" size="md">
                <Link to={linkUrl} className="flex items-center gap-1">
                  {buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden">
              <div className="aspect-[21/9] overflow-hidden bg-ivory">
                <img
                  src={imageUrl}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.triedFallback) {
                      img.style.display = 'none';
                      return;
                    }
                    img.dataset.triedFallback = 'true';
                    img.src = 'https://placehold.co/1920x500/f8f4ec/999?text=Editorial';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
