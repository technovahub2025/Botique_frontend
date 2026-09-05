
import { Link } from 'react-router-dom';
import AutoMedia from '../common/AutoMedia';

const CategoryCard = ({ category, imageSize = 'square' }) => {
  const sizeClasses = {
    wide: 'aspect-[16/9]',
    square: 'aspect-square',
  };

  const videoMimeType = category.videoMetadata?.mimeType || '';

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden bg-cream">
        <AutoMedia
          image={category.image}
          video={category.video}
          videoMimeType={videoMimeType}
          alt={category.name}
          objectFit="object-cover object-center"
          className={sizeClasses[imageSize] || sizeClasses.square}
          fallbackText="No image"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category information */}
        <div className="absolute bottom-4 left-4 right-4 text-ivory opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="font-heading text-xl font-medium">
            {category.name}
          </h3>

          {category.description && (
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Text below card */}
      <div className="mt-3 text-center">
        <h3 className="font-heading text-lg font-medium text-charcoal group-hover:text-burgundy transition-colors">
          {category.name}
        </h3>

        {category.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;

