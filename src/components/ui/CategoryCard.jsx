import { Link } from 'react-router-dom';
import HoverMedia from './HoverMedia';

const CategoryCard = ({ category, imageSize = 'square' }) => {
  const sharedImgClass = 'transition-transform duration-700 group-hover:scale-105';
  const wideFallback = 'https://placehold.co/800x450/eee/999?text=No+Image';
  const squareFallback = 'https://placehold.co/600x600/eee/999?text=No+Image';

  return (
    <Link to={`/shop?category=${category.slug}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        {imageSize === 'wide' ? (
          <div className="aspect-[16/9] overflow-hidden">
            <HoverMedia
              image={category.image}
              video={category.video}
              alt={category.name}
              imageClassName={sharedImgClass}
              videoClassName={sharedImgClass}
              fallback={
                <img
                  src={wideFallback}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              }
            />
          </div>
        ) : (
          <div className="aspect-square overflow-hidden">
            <HoverMedia
              image={category.image}
              video={category.video}
              alt={category.name}
              imageClassName={sharedImgClass}
              videoClassName={sharedImgClass}
              fallback={
                <img
                  src={squareFallback}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              }
            />
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
