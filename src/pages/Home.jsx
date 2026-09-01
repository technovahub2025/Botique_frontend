import Hero from '../components/sections/Hero';
import ProductCarousel from '../components/sections/ProductCarousel';
import ShopByCategory from '../components/sections/ShopByCategory';
import FeaturedCollection from '../components/sections/FeaturedCollection';
import EditorialSection from '../components/sections/EditorialSection';
import CollectionGrid from '../components/sections/CollectionGrid';
import Craftsmanship from '../components/sections/Craftsmanship';
import TrendingProducts from '../components/sections/TrendingProducts';
import PriceSections from '../components/sections/PriceSections';
import Newsletter from '../components/layout/Newsletter';
import { HomepageSettingsProvider, useHomepageSettings } from '../context/HomepageSettingsContext';

const HomeContent = () => {
  const { getSection, isSectionEnabled } = useHomepageSettings();
  const newArrivals = getSection('new_arrivals');
  const arrivalsLimit = newArrivals.limit || 8;

  return (
    <div className="flex flex-col fade-in">
      {isSectionEnabled('hero') && <Hero />}

      {isSectionEnabled('new_arrivals') && (
        <ProductCarousel
          title={newArrivals.title || 'New Arrivals'}
          subtitle={newArrivals.subtitle || 'Freshly woven, just in'}
          apiParams={{ limit: arrivalsLimit, sortBy: 'createdAt', order: 'desc', newArrival: true }}
        />
      )}

      {isSectionEnabled('shop_by_category') && <ShopByCategory />}

      {isSectionEnabled('featured_collection') && <FeaturedCollection />}

      {isSectionEnabled('editorial') && <EditorialSection />}

      <CollectionGrid />

      {isSectionEnabled('craftsmanship') && <Craftsmanship />}

      {isSectionEnabled('trending') && <TrendingProducts />}

      {isSectionEnabled('price_sections') && <PriceSections />}

      {isSectionEnabled('newsletter') && <Newsletter />}
    </div>
  );
};

const Home = () => {
  return (
    <HomepageSettingsProvider>
      <HomeContent />
    </HomepageSettingsProvider>
  );
};

export default Home;
