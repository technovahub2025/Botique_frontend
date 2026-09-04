import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/imageUrl';
import MediaDisplay from './MediaDisplay';

const CategoryCard = ({ category, imageSize = 'square' }) => {
  const imageSrc = category.image
    ? getImageUrl(category.image)
    : '';

  const sharedImgClass = 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105';
  const wideFallback = 'https://placehold.co/800x450/eee/999?text=No+Image';
  const squareFallback = 'https://placehold.co/600x600/eee/999?text=No+Image';

  const renderMedia = () => (
    <MediaDisplay
      src={imageSrc}
      alt={category.name}
      loading="lazy"
      objectFit="object-cover"
      className="transition-transform duration-700 group-hover:scale-105"
      fallback={
        <img
          src={imageSize === 'wide' ? wideFallback : squareFallback}
          alt={category.name}
          loading="lazy"
          className={sharedImgClass}
        />
      }
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.dataset.triedFallback) {
          img.dataset.triedFallback = 'true';
          img.src = imageSize === 'wide' ? wideFallback : squareFallback;
        }
      }}
    />
  );

  return (
    <Link to={`/shop?category=${category.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        {imageSize === 'wide' ? (
          <div className="aspect-[16/9] overflow-hidden">
            {imageSrc ? renderMedia() : (
              <img
                src={wideFallback}
                alt={category.name}
                loading="lazy"
                className={sharedImgClass}
              />
            )}
          </div>
        ) : (
          <div className="aspect-square overflow-hidden">
            {imageSrc ? renderMedia() : (
              <img
                src={squareFallback}
                alt={category.name}
                loading="lazy"
                className={sharedImgClass}
              />
            )}
          </div>
        )}
      </div>
      <div className={`mt-3 ${imageSize === 'wide' ? 'text-center' : 'text-center'}`}>
        <h3 className="font-heading text-lg font-medium text-charcoal group-hover:text-burgundy transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
