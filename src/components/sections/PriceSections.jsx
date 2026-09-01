import { Link } from 'react-router-dom';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const DEFAULT_PRICE_CARDS = [
  { title: 'UNDER ₹15K', description: 'Accessible luxury starting points.', minPrice: 0, maxPrice: 15000, link: '/shop?maxPrice=15000' },
  { title: 'UNDER ₹25K', description: 'Statement pieces and heirloom silhouettes.', minPrice: 15001, maxPrice: 25000, link: '/shop?maxPrice=25000' },
  { title: 'UNDER ₹40K', description: 'Bespoke and collector-grade designs.', minPrice: 25001, maxPrice: 40000, link: '/shop?maxPrice=40000' },
];

const PriceSections = () => {
  const { getSection } = useHomepageSettings();
  const section = getSection('price_sections');
  const title = section.title || 'Find Your Investment';
  const subtitle = section.subtitle || 'Curated By Price';

  const rawCards = section.cards;
  const cards = Array.isArray(rawCards) && rawCards.length > 0
    ? rawCards.filter((c) => c && c.enabled !== false)
    : DEFAULT_PRICE_CARDS.map((c, i) => ({ ...c, order: i + 1 }));

  const sortedCards = [...cards].sort((a, b) => (a.order || 0) - (b.order || 0));

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
          {sortedCards.map((card, i) => (
            <Link
              key={card.link || card.title || `card-${i}`}
              to={card.link || `/shop?maxPrice=${card.maxPrice || 0}`}
              className="group block bg-cream border border-gray-200 transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-ivory to-cream flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <span className="font-heading text-2xl text-charcoal tracking-wider">
                    {card.title}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="font-heading text-lg text-charcoal group-hover:text-burgundy transition-colors">
                  {card.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceSections;
