import { Link } from 'react-router-dom';
import AutoMedia from '../common/AutoMedia';

const CategoryCard = ({ category, imageSize = 'square' }) => {
  if (!category) return null;

  const videoMimeType = category.videoMetadata?.mimeType || '';

  return (
    <Link to={`/shop?category=${category.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream aspect-[3/4]">
        <AutoMedia
          image={category.image}
          video={category.video}
          videoMimeType={videoMimeType}
          alt={category.name}
          objectFit="object-cover object-center"
          className="absolute inset-0 w-full h-full"
          fallbackText="No image"
        />
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
