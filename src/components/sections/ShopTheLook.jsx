import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toArray } from '../../utils';
import LookCard from '../ui/LookCard';
import SectionHeading from '../ui/SectionHeading';
import { useHomepageSettings } from '../../context/HomepageSettingsContext';

const ShopTheLook = () => {
  const [products, setProducts] = useState([]);
  const { getSection } = useHomepageSettings();
  const shopTheLook = getSection('shop_the_look');

  const title = shopTheLook.title || 'Shop The Look';
  const subtitle = shopTheLook.subtitle || 'Style inspiration from our artisans';
  const sectionImages = toArray(shopTheLook.images);
  const description = shopTheLook.description || '';

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await api.get('/products?limit=6&sortBy=createdAt&order=desc&featured=true');
        setProducts(toArray(res.data, ['products']));
      } catch {
        setProducts([]);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-ivory">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         {sectionImages
            .filter((img) => img && img.toString().trim())
            .map((img, i) => (
              <LookCard
                key={`look-${i}`}
                look={{
                  title,
                  description: description || '',
                  tag: 'Featured',
                  image: img.toString().trim(),
                  products: [],
                }}
              />
            ))}

          {products.map((product) => (
            <LookCard
              key={product._id}
              look={{
                title: product.name,
                description: product.description?.substring(0, 100),
                tag: product.salePrice ? 'Sale' : null,
                image: product.images?.[0],
                products: [product],
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;
