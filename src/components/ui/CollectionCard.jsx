import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/imageUrl';
import MediaDisplay from './MediaDisplay';

const CollectionCard = ({ collection, size = 'medium' }) => {
  const rawImage = collection.heroImage || collection.bannerImage;
  const imageSrc = rawImage ? getImageUrl(rawImage) : '';

  const sizeClasses = {
    small: 'aspect-[3/4]',
    medium: 'aspect-[2/3]',
    wide: 'aspect-[16/9]',
    square: 'aspect-square',
  };

  const sharedImgClass = 'w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105';

  return (
    <Link to={`/shop?collection=${collection.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        <div className={`overflow-hidden ${sizeClasses[size] || sizeClasses.medium}`}>
          {imageSrc ? (
            <MediaDisplay
              src={imageSrc}
              alt={collection.name}
              loading="lazy"
              objectFit="object-cover object-center"
              className="transition-transform duration-700 group-hover:scale-105"
              fallback={
                <img
                  src="https://placehold.co/800x1000/eee/999?text=No+Image"
                  alt={collection.name}
                  loading="lazy"
                  className={sharedImgClass}
                />
              }
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.triedFallback) {
                  img.dataset.triedFallback = 'true';
                  img.src = 'https://placehold.co/800x1000/eee/999?text=No+Image';
                }
              }}
            />
          ) : (
            <img
              src="https://placehold.co/800x1000/eee/999?text=No+Image"
              alt={collection.name}
              loading="lazy"
              className={sharedImgClass}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-heading text-xl font-medium">{collection.name}</h3>
          {collection.description && (
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">{collection.description}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;
