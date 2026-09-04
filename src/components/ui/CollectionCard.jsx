import { Link } from 'react-router-dom';
import HoverMedia from './HoverMedia';

const CollectionCard = ({ collection, size = 'medium' }) => {
  const sizeClasses = {
    small: 'aspect-[3/4]',
    medium: 'aspect-[2/3]',
    wide: 'aspect-[16/9]',
    square: 'aspect-square',
  };

  return (
    <Link to={`/shop?collection=${collection.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        <HoverMedia
          image={collection.heroImage || collection.bannerImage}
          video={collection.heroVideo || collection.bannerVideo}
          alt={collection.name}
          containerClassName={sizeClasses[size] || sizeClasses.medium}
          imageClassName="transition-transform duration-700 group-hover:scale-105"
          videoClassName="transition-transform duration-700 group-hover:scale-105"
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
