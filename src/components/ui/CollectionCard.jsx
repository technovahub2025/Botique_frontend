import { Link } from 'react-router-dom';

const CollectionCard = ({ collection, size = 'medium' }) => {
  const imageSrc =
    collection.heroImage ||
    collection.bannerImage ||
    'https://placehold.co/800x1000/eee/999?text=No+Image';

  const sizeClasses = {
    small: 'aspect-[3/4]',
    medium: 'aspect-[2/3]',
    wide: 'aspect-[16/9]',
    square: 'aspect-square',
  };

  return (
    <Link to={`/shop?collection=${collection.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        <div className={`overflow-hidden ${sizeClasses[size] || sizeClasses.medium}`}>
          <img
            src={imageSrc}
            alt={collection.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://placehold.co/800x1000/eee/999?text=No+Image';
            }}
          />
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
