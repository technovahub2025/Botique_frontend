import { Link } from 'react-router-dom';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const PriceSections = () => {
  const { getSection } = useHomepageSettings();

  const section = getSection('price_sections') || {};

  const title = section.title || 'Find Your Investment';
  const subtitle = section.subtitle || 'Curated By Price';

  /*
   * Price cards are controlled entirely by the Admin Panel.
   *
   * No default / hard-coded price cards are created here.
   */
  const cards = Array.isArray(section.cards)
    ? section.cards.filter(
        (card) => card && card.enabled !== false
      )
    : [];

  /*
   * Respect the order configured by the admin.
   */
  const sortedCards = [...cards].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  /*
   * If the admin has not added any cards,
   * don't display an empty section.
   */
  if (sortedCards.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ==============================
            SECTION HEADING
        ============================== */}
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-burgundy uppercase tracking-widest mb-2">
            {subtitle}
          </p>

          <h2 className="font-heading text-3xl md:text-4xl text-charcoal">
            {title}
          </h2>
        </div>

        {/* ==============================
            PRICE CARDS
        ============================== */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {sortedCards.map((card, index) => {
            const imageUrl = card?.imageUrl || '';

            const destination =
              card?.link ||
              (
                card?.maxPrice !== undefined &&
                card?.maxPrice !== null
                  ? `/shop?maxPrice=${card.maxPrice}`
                  : '/shop'
              );

            return (
              <Link
                key={
                  card?.id ||
                  card?._id ||
                  `${card?.title || 'price-card'}-${index}`
                }
                to={destination}
                className="
                  group
                  block
                  bg-cream
                  border
                  border-gray-200
                  transition-all
                  duration-300
                "
              >

                {/* ==============================
                    IMAGE
                ============================== */}
                {imageUrl ? (
                  <div
                    className="
                      w-full
                      overflow-hidden
                      bg-cream
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <img
                      src={imageUrl}
                      alt={card?.title || 'Collection'}
                      className="
                        w-full
                        h-auto
                        object-contain
                        object-center
                        block
                      "
                    />
                  </div>
                ) : (
                  /* ==============================
                     NO IMAGE
                  ============================== */
                  <div
                    className="
                      w-full
                      h-[355px]
                      bg-gradient-to-br
                      from-ivory
                      to-cream
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="
                        font-heading
                        text-2xl
                        text-charcoal
                        tracking-wider
                      "
                    >
                      {card?.title || 'Price Range'}
                    </span>
                  </div>
                )}

                {/* ==============================
                    CARD CONTENT
                ============================== */}
                <div className="p-6">

                  {card?.title && (
                    <p
                      className="
                        font-heading
                        text-lg
                        text-charcoal
                        group-hover:text-burgundy
                        transition-colors
                      "
                    >
                      {card.title}
                    </p>
                  )}

                  {card?.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {card.description}
                    </p>
                  )}

                </div>

              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PriceSections;