import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ShopView from '../components/sections/ShopView';
import { getImageUrl } from '../services/imageUrl';
import { toArray } from '../utils';

const CollectionPage = () => {
  const { slug } = useParams();
  const [collectionName, setCollectionName] = useState(null);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await api.get(`/collections/slug/${slug}`);
        setCollectionName(res.data.collection.name);
        setCollection(res.data.collection);
      } catch {
        try {
          const res = await api.get('/collections?status=active');
          const found = toArray(res.data, ['collections']).find((c) => c.slug === slug);
          setCollectionName(found?.name || slug);
          setCollection(found || null);
        } catch {
          setCollectionName(slug);
        }
      }
    };
    fetchCollection();
  }, [slug]);

  return (
    <>
      {collection && (
        <div
          className="h-48 md:h-64 bg-cover bg-center flex items-center justify-center text-ivory"
          style={{
            backgroundImage: (() => {
              const raw = collection.heroImage || collection.bannerImage;
              const src = raw ? getImageUrl(raw) : 'https://placehold.co/1200x400/f8f4ec/999';
              return `url('${src}')`;
            })(),
          }}
        >
          <h1 className="font-heading text-3xl md:text-4xl text-center">
            {collection.name}
          </h1>
        </div>
      )}
      <ShopView
        collectionSlug={slug}
        title={collectionName || slug}
      />
    </>
  );
};

export default CollectionPage;
