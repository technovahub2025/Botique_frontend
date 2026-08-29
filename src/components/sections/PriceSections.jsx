import { Link } from 'react-router-dom';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const PriceSections = () => {
  const { getSection } = useHomepageSettings();
  const section = getSection('price_sections');
  const title = section.title || 'Find Your Investment';
  const subtitle = section.subtitle || 'Curated By Price';

  const priceRanges = [
    { label: 'UNDER ₹15K', to: '/shop?maxPrice=15000', description: 'Accessible luxury starting points.' },
    { label: 'UNDER ₹25K', to: '/shop?maxPrice=25000', description: 'Statement pieces and heirloom silhouettes.' },
    { label: 'UNDER ₹40K', to: '/shop?maxPrice=40000', description: 'Bespoke and collector-grade designs.' },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-burgundy uppercase tracking-widest mb-2">
            {subtitle}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-charcoal">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {priceRanges.map((range) => (
            <Link
              key={range.label}
              to={range.to}
              className="group block bg-cream border border-gray-200 transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-ivory to-cream flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <span className="font-heading text-2xl text-charcoal tracking-wider">
                    {range.label}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="font-heading text-lg text-charcoal group-hover:text-burgundy transition-colors">
                  {range.label}
                </p>
                <p className="text-sm text-gray-500 mt-1">{range.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceSections;
