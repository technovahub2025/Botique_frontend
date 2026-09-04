import { Link } from 'react-router-dom';
import AutoMediaCarousel from './AutoMediaCarousel';

const CategoryCard = ({ category, imageSize = 'square' }) => {
  const sharedImgClass = 'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105';
  const wideFallback = 'https://placehold.co/800x450/eee/999?text=No+Image';
  const squareFallback = 'https://placehold.co/600x600/eee/999?text=No+Image';

  const videoMimeType = category.videoMetadata?.mimeType || '';

  const renderMedia = (fallbackSrc) => (
    <AutoMediaCarousel
      image={category.image}
      video={category.video}
      videoMimeType={videoMimeType}
      alt={category.name}
      objectFit="object-cover"
      imageClassName="transition-transform duration-700 group-hover:scale-105"
      videoClassName="transition-transform duration-700 group-hover:scale-105"
      fallback={
        <img
          src={fallbackSrc}
          alt={category.name}
          loading="lazy"
          className={sharedImgClass}
        />
      }
    />
  );

  return (
    <Link to={`/shop?category=${category.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        {imageSize === 'wide' ? (
          <div className="aspect-[16/9] overflow-hidden">
            {renderMedia(wideFallback)}
          </div>
        ) : (
          <div className="aspect-square overflow-hidden">
            {renderMedia(squareFallback)}
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
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
