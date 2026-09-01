import { Link } from 'react-router-dom';
import { formatPrice, getEffectivePrice } from '../../utils';
import { getImageUrl } from '../../services/imageUrl';

const LookCard = ({ look }) => {
  const { title, description, products, image, tag } = look;
  const firstProduct = products && products.length > 0 ? products[0] : null;
  const price = firstProduct
    ? getEffectivePrice(firstProduct.price, firstProduct.salePrice)
    : null;

  return (
    <Link to={products && products.length > 0 ? `/product/${firstProduct.slug || firstProduct._id}` : '/shop'} className="group block">
      <div className="relative bg-cream overflow-hidden">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={getImageUrl(image) || 'https://placehold.co/600x800/eee/999?text=Look+Image'}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.triedFallback) {
                img.style.display = 'none';
                return;
              }
              img.dataset.triedFallback = 'true';
              img.src = 'https://placehold.co/600x800/eee/999?text=Look+Image';
            }}
          />
        </div>

        {tag && (
          <span className="absolute top-3 left-3 bg-burgundy text-ivory text-xs font-medium px-2 py-1 uppercase tracking-wider">
            {tag}
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-ivory">
          <h3 className="font-heading text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-gray-300 mt-1 line-clamp-2">{description}</p>
          )}
          {price !== null && (
            <p className="text-sm font-medium mt-2 text-gold">{formatPrice(price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LookCard;
