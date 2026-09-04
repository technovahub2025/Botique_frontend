import { Link } from 'react-router-dom';
import AutoMedia from '../common/AutoMedia';

const CollectionCard = ({ collection, size = 'medium' }) => {
  const sizeClasses = {
    small: 'aspect-[3/4]',
    medium: 'aspect-[2/3]',
    wide: 'aspect-[16/9]',
    square: 'aspect-square',
  };

  const heroVideoMimeType = collection.heroVideoMetadata?.mimeType || '';
  const bannerVideoMimeType = collection.bannerVideoMetadata?.mimeType || '';

  return (
    <Link to={`/shop?collection=${collection.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        <AutoMedia
          image={collection.heroImage || collection.bannerImage}
          video={collection.heroVideo || collection.bannerVideo}
          videoMimeType={heroVideoMimeType || bannerVideoMimeType}
          alt={collection.name}
          objectFit="object-cover object-center"
          className={sizeClasses[size] || sizeClasses.medium}
        />
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
