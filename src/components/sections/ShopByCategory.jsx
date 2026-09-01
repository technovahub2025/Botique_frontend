import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toArray } from '../../utils';
import CategoryCard from '../ui/CategoryCard';
import SectionHeading from '../ui/SectionHeading';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getSection } = useHomepageSettings();
  const section = getSection('shop_by_category');
  const title = section.title || 'Shop By Category';
  const subtitle = section.subtitle || 'Curated by silhouette';

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get('/categories?status=active');
         setCategories(toArray(res.data, ['categories']));
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading title={title} subtitle={subtitle} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-cream animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeading title={title} subtitle={subtitle} />
          <p className="text-center text-gray-500 mt-8">Categories coming soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-ivory">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
