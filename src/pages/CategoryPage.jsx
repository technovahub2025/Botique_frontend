import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { toArray } from '../utils';
import ShopView from '../components/sections/ShopView';

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryName, setCategoryName] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
         const res = await api.get('/categories?status=active');
         const found = toArray(res.data, ['categories']).find((c) => c.slug === slug);
        setCategoryName(found?.name || slug);
      } catch {
        setCategoryName(slug);
      }
    };
    fetchCategory();
  }, [slug]);

  return (
    <ShopView
      categorySlug={slug}
      title={categoryName || slug}
    />
  );
};

export default CategoryPage;
