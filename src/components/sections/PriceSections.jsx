import { Link } from 'react-router-dom';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

/*
 * Detect video from URL when possible.
 */
const isVideoUrl = (url = '') => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const cleanUrl = url
    .split('?')[0]
    .split('#')[0]
    .toLowerCase();

  return (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.endsWith('.m4v') ||
    cleanUrl.endsWith('.ogv') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.endsWith('.mpeg') ||
    cleanUrl.endsWith('.mpg')
  );
};

/*
 * Detect video using metadata returned by the backend.
 */
const hasVideoMimeType = (card) => {
  const mimeType =
    card?.videoMetadata?.mimeType ||
    card?.mediaMetadata?.mimeType ||
    card?.mimeType ||
    '';

  return (
    typeof mimeType === 'string' &&
    mimeType.toLowerCase().startsWith('video/')
  );
};

/*
 * Determine whether the admin-selected media is a video.
 */
const isVideoMedia = (card, mediaUrl) => {
  return (
    hasVideoMimeType(card) ||
    isVideoUrl(mediaUrl)
  );
};

const PriceSections = () => {
  const { getSection } = useHomepageSettings();

  const section = getSection('price_sections') || {};

  const title = section.title || 'Find Your Investment';
  const subtitle = section.subtitle || 'Curated By Price';

  /*
   * IMPORTANT:
   * Cards come ONLY from the admin settings.
   *
   * There are NO hard-coded price cards here.
   */
  const cards = Array.isArray(section.cards)
    ? section.cards.filter(
        (card) => card && card.enabled !== false
      )
    : [];

  /*
   * Respect the order set by the admin.
   */
  const sortedCards = [...cards].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  /*
   * If admin has not created any cards,
   * don't show fake/default cards.
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
            ADMIN CONTROLLED CARDS
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

            /*
             * Admin can provide either:
             * - imageUrl
             * - video
             * - videoUrl
             * - videoURL
             */
            const mediaUrl =
              card?.videoUrl ||
              card?.videoURL ||
              card?.video ||
              card?.imageUrl ||
              '';

            const hasMedia = Boolean(mediaUrl);

            const isVideo = isVideoMedia(
              card,
              mediaUrl
            );

            const destination =
              card?.link ||
              (
                card?.maxPrice
                  ? `/shop?maxPrice=${card.maxPrice}`
                  : '/shop'
              );

            return (
              <Link
                key={
                  card.id ||
                  card._id ||
                  card.link ||
                  `${card.title}-${index}`
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
                    MEDIA
                ============================== */}
                {hasMedia ? (
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
                    {isVideo ? (
                      <video
                        src={mediaUrl}
                        className="
                          w-full
                          h-auto
                          object-contain
                          object-center
                          block
                        "
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={
                          card?.title ||
                          'Collection'
                        }
                        className="
                          w-full
                          h-auto
                          object-contain
                          object-center
                          block
                        "
                      />
                    )}
                  </div>
                ) : (
                  /* ==============================
                     NO MEDIA
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
                      {card?.title}
                    </span>
                  </div>
                )}

                {/* ==============================
                    CARD INFORMATION
                ============================== */}
                <div className="p-6">

                  <p
                    className="
                      font-heading
                      text-lg
                      text-charcoal
                      group-hover:text-burgundy
                      transition-colors
                    "
                  >
                    {card?.title}
                  </p>

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