import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';
import { getImageUrl } from '../../services/imageUrl';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512436955456-8a671a6b0e4c?auto=format&fit=crop&w=1920&h=700&q=50';
const AUTO_PLAY_DELAY = 5500;
const MOBILE_CONTAINER_RATIO = 16 / 9;
const DESKTOP_CONTAINER_RATIO = 21 / 9;

const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (/^data:/i.test(url) && /image/i.test(url)) return true;
  try {
    const u = new URL(url, 'http://localhost');
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizeSlide = (slide, index, globalHero) => {
  const isObj = slide && typeof slide === 'object';
  const isActive = isObj
    ? slide.isActive !== undefined
      ? slide.isActive
      : slide.enabled !== undefined
        ? slide.enabled
        : true
    : true;
  return {
    id: (isObj && (slide.id || slide._id)) || `slide-${index}`,
    imageUrl: isObj ? (slide.imageUrl || slide.image || '') : slide,
    smallLabel: isObj ? (slide.smallLabel || '') : '',
    heading: isObj ? (slide.heading || globalHero.heading) : globalHero.heading,
    description: isObj ? (slide.description || globalHero.description) : globalHero.description,
    buttonText: isObj
      ? (slide.buttonText || globalHero.buttonText || 'Discover Collection')
      : (globalHero.buttonText || 'Discover Collection'),
    buttonLink: isObj
      ? (slide.buttonLink || globalHero.buttonLink || '/')
      : (globalHero.buttonLink || '/'),
    order: isObj ? (slide.order || index + 1) : index + 1,
    isActive,
    enabled: isActive,
  };
};

const Hero = () => {
  const { getSection } = useHomepageSettings();
  const heroSection = getSection('hero');

  const globalHero = useMemo(
    () => ({
      heading: heroSection.heading || 'Elegance Woven Into Every Thread',
      description:
        heroSection.description ||
        'Discover award-winning handloom collections where traditional Indian craftsmanship meets contemporary design.',
      buttonText: heroSection.ctaText || 'Discover Collection',
      buttonLink: heroSection.ctaLink || '/collections',
    }),
    [heroSection]
  );

  const rawSlides = heroSection.heroImages;

  const validSlides = useMemo(
    () =>
      (Array.isArray(rawSlides) ? rawSlides : [])
        .map((s, i) => normalizeSlide(s, i, globalHero))
        .filter((s) => isValidImageUrl(s.imageUrl)),
    [rawSlides, globalHero]
  );

  const slides = useMemo(
    () => (validSlides.length ? validSlides : [normalizeSlide(FALLBACK_IMAGE, 0, globalHero)]),
    [validSlides, globalHero]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());
  const [imageMeta, setImageMeta] = useState({});
  const [containerRatio, setContainerRatio] = useState(MOBILE_CONTAINER_RATIO);
  const containerRef = useRef(null);
  const slideTransitionRef = useRef(null);
  const navResetRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateRatio = () => {
      const r = el.getBoundingClientRect();
      setContainerRatio(r.width && r.height ? r.width / r.height : DESKTOP_CONTAINER_RATIO);
    };
    updateRatio();
    window.addEventListener('resize', updateRatio);
    return () => window.removeEventListener('resize', updateRatio);
  }, []);

  const getFitStrategy = (slide) => {
    const meta = imageMeta[slide.id];
    if (!meta || !meta.naturalHeight) return 'cover';
    const sourceRatio = meta.naturalWidth / meta.naturalHeight;
    return sourceRatio >= containerRatio ? 'cover' : 'contain';
  };

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % slides.length);
    navResetRef.current = true;
  };
  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + slides.length) % slides.length);
    navResetRef.current = true;
  };

  useEffect(() => {
    if (!isHovered && slides.length > 1) {
      slideTransitionRef.current = setTimeout(() => {
        setActiveIndex((i) => (i + 1) % slides.length);
      }, AUTO_PLAY_DELAY);
      return () => clearTimeout(slideTransitionRef.current);
    }
    return () => clearTimeout(slideTransitionRef.current);
  }, [isHovered, activeIndex, slides.length]);

  useEffect(() => {
    if (!navResetRef.current) return;
    const t = setTimeout(() => {
      navResetRef.current = false;
    }, 700);
    return () => clearTimeout(t);
  }, [slides.length]);

  const safeIndex = Math.min(activeIndex, slides.length - 1);
  const currentSlide = slides[safeIndex];

  return (
    <section
      className="relative w-full bg-charcoal text-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[480px] min-h-[280px] lg:max-h-[720px] lg:min-h-[500px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />

        {slides.map((slide, i) => {
          const isActive = i === safeIndex;
          const loaded = loadedImages.has(slide.id);
          const failed = failedImages.has(slide.id);
          const imgSrc = failed ? FALLBACK_IMAGE : getImageUrl(slide.imageUrl);
          const strategy = getFitStrategy(slide);
          const fitClass = strategy === 'cover' ? 'object-cover' : 'object-contain';

          if (import.meta.env.DEV) {
            console.debug(`[Hero] slide=${slide.id} index=${i} strategy=${strategy} src=${imgSrc}`);
          }
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full overflow-hidden ${
                isActive ? 'z-10' : 'z-0'
              }`}
            >
              <img
                src={imgSrc}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60 scale-105"
              />
              <img
                src={imgSrc}
                alt={slide.heading || slide.smallLabel || 'Hero banner'}
                loading="eager"
                decoding="async"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setImageMeta((m) => ({
                    ...m,
                    [slide.id]: {
                      naturalWidth: img.naturalWidth,
                      naturalHeight: img.naturalHeight,
                    },
                  }));
                  setLoadedImages((l) => new Set(l).add(slide.id));
                }}
                onError={() => setFailedImages((f) => new Set(f).add(slide.id))}
                className={`absolute inset-0 w-full h-full ${fitClass} object-center`}
                style={{
                  opacity: isActive && loaded ? 1 : 0,
                  transition: isActive && loaded ? 'opacity 400ms ease-out' : 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })}

        <div className="absolute left-4 md:left-6 lg:left-8 top-6 md:top-8 lg:top-10 z-10 w-full max-w-xs sm:max-w-sm md:max-w-xl">
          {currentSlide.smallLabel && (
            <p className="text-xs font-medium tracking-widest text-gold-light uppercase mb-3">
              {currentSlide.smallLabel}
            </p>
          )}
          {currentSlide.heading && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold leading-tight mb-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              {currentSlide.heading}
            </h1>
          )}
          {currentSlide.description && (
            <p className="text-sm md:text-base text-gray-200 max-w-xl drop-shadow-[0_1px_5px_rgba(0,0,0,0.7)]">
              {currentSlide.description}
            </p>
          )}
          {(currentSlide.buttonText || currentSlide.buttonLink) && (
            <div className="mt-5">
              <Button
                as={Link}
                to={currentSlide.buttonLink}
                variant="primary"
                size="md"
                className="bg-gold hover:bg-gold-dark text-charcoal font-medium shadow-lg shadow-black/30"
              >
                {currentSlide.buttonText}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setActiveIndex(i);
              navResetRef.current = true;
            }}
            className={`h-2 rounded-full transition-all ${
              i === safeIndex ? 'w-6 bg-gold' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  );
};

export default Hero;
