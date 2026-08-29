import { Link } from 'react-router-dom';

const AnnouncementBar = ({ text = 'Free shipping on orders above ₹5,000 | COD available across India', link = '/shop', linkText = 'Shop Now' }) => {
  return (
    <div className="bg-charcoal text-ivory text-center text-xs py-2 px-4">
      <span>{text}</span>
      <Link
        to={link}
        className="ml-2 text-gold hover:underline font-medium"
      >
        {linkText}
      </Link>
    </div>
  );
};

export default AnnouncementBar;
