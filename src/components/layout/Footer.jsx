import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c2.7 0 4.7 2.1 4.7 4.7v9.7c0 2.7-2.1 4.7-4.7 4.7S7.3 19.1 7.3 16.4V6.7C7.3 4.1 9.3 2 12 2z" />
      <path d="M16.5 4.5v.1" />
      <circle cx="12" cy="12" r="3.3" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.8v-6.9H7.5v-2.9h2.9V9.4c0-2.9 1.7-4.6 4.4-4.6 1.3 0 2.5.1 2.5.1v2.8h-1.4c-1.4 0-1.7.5-1.7 1.6v2.2h2.9l-.5 2.9h-2.6v6.9C18.3 21.1 22 17 22 12" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 20.5c-1.5-.5-2.8-1.3-3.7-2.4-.1 0-.2-.1-.3-.1.3-.9.7-1.8 1.2-2.7.1.1.2.1.3.1 1.1 0 2-.5 2.7-1.3.2-.3.4-.6.5-.9 0 0-.2-.1-.2-.1-1.2 0-2.4-.5-3.1-1.5-.1-.2-.2-.4-.3-.7 0 0 .3-.2.5-.2 1.4 0 2.7.7 3.6 1.8.6-.2 1.3-.3 2-.3.1 0 .3 0 .4.1.1 0 .1 0 .1.1-.1.2-.2.4-.2.6 0 .4.1.9.1 1.1 0 .2.1.3.1.4-.1.2-.2.4-.4.6-.1.2-.2.3-.3.5-.2.3-.5.6-.8.8-.3.2-.6.4-1 .5v.1c0 1.4.4 2.8 1.2 3.8.8 1 1.9 1.7 3.1 2.1 0 .1.1.1.1.2v.1c0 .3 0 .6-.1.9-.8.4-1.7.6-2.6.6-1.3 0-2.5-.3-3.7-.9" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 5.2c-.7.3-1.5.6-2.3.8.9-.5 1.6-1.3 1.9-2.3-.7.5-1.5.8-2.4 1-.7-.8-1.8-1.2-2.9-1-2.2 0-3.9 1.8-3.9 4.1 0 .9.1 1.7.2 2.5-3.8-.2-7.2-2-9.2-4.8-.4.8-.6 1.8-.6 2.8 0 1.9 1 3.7 2.5 4.8-.8 0-1.6-.3-2.2-.6 0 1.8 1.3 3.3 3 3.7-.6.2-1.2.2-1.8.1 0 1.8 1.3 3.4 3.2 3.7-1.1.9-2.5 1.4-4 1.4-.3 0-.5 0-.8-.1 3 1.9 6.6 3 10.4 3 12.5 0 19.3-10.3 19.3-19.2 0-.3 0-.5-.1-.8.8-.6 1.6-1.3 2.2-2.1" />
    </svg>
  ),
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { boutiqueName, email, phone, address } = useSettings();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'New Arrivals', to: '/shop?newArrival=true' },
        { label: 'Collections', to: '/shop' },
        { label: 'Sarees', to: '/shop?category=silk-sarees' },
        { label: 'Lehengas', to: '/shop' },
        { label: 'Kurtas', to: '/shop' },
        { label: 'Sale', to: '/shop' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Contact Us', to: '/contact' },
        { label: 'Shipping Policy', to: '/about' },
        { label: 'Returns & Exchange', to: '/about' },
        { label: 'Privacy Policy', to: '/about' },
        { label: 'Terms of Service', to: '/about' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'My Account', to: '/account' },
        { label: 'My Orders', to: '/orders' },
        { label: 'Wishlist', to: '/wishlist' },
        { label: 'Login', to: '/login' },
      ],
    },
  ];

  return (
    <footer className="bg-ivory border-t border-gray-200 text-charcoal pt-12 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <Link to="/" className="font-heading text-2xl font-medium text-charcoal">
              {boutiqueName}
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              Timeless Indian handloom and luxury fashion, curated for the modern connoisseur.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal hover:text-burgundy transition-colors"
              >
                {socialIcons.instagram}
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal hover:text-burgundy transition-colors"
              >
                {socialIcons.facebook}
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal hover:text-burgundy transition-colors"
              >
                {socialIcons.pinterest}
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal hover:text-burgundy transition-colors"
              >
                {socialIcons.twitter}
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-sm font-medium text-charcoal mb-4 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-burgundy transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-heading text-sm font-medium text-charcoal mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-gray-500">
              <p>{email}</p>
              <p>{phone}</p>
              <p>
                {address}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>&copy; {currentYear} {boutiqueName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
