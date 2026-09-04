import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ShopView from '../components/sections/ShopView';
import HoverMedia from '../components/ui/HoverMedia';
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
        <div className="relative h-48 md:h-64 flex items-center justify-center text-ivory">
          <HoverMedia
            image={collection.heroImage || collection.bannerImage}
            video={collection.heroVideo || collection.bannerVideo}
            alt={collection.name}
            objectFit="object-cover"
            containerClassName="absolute inset-0"
            imageClassName="w-full h-full"
            videoClassName="absolute inset-0 w-full h-full"
          />
          <h1 className="relative z-10 font-heading text-3xl md:text-4xl text-center">
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
