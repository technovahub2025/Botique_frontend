import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Search, ShoppingCart, User, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useSettings } from '../../context/SettingsContext';
import useClickAway from '../../hooks/useClickAway';
import api from '../../services/api';
import { toArray, slugify } from '../../utils';


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const { totalItems: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { boutiqueName } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useClickAway(() => setSearchOpen(false));
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories?status=active');
         setCategories(toArray(res.data, ['categories']));
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category) => {
    const slug = category.slug || slugify(category.name);
    navigate(`/category/${slug}`);
    setCategoryDropdownOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs font-medium tracking-wider transition-colors ${
      isActive ? 'text-burgundy' : 'text-charcoal hover:text-burgundy'
    }`;

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <header className="bg-ivory border-b border-gray-200 sticky top-0 z-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-charcoal hover:text-burgundy"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <NavLink to="/shop?newArrival=true" className={navLinkClass}>
                NEW ARRIVALS
              </NavLink>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-1 text-xs font-medium tracking-wider transition-colors ${
                    categoryDropdownOpen ? 'text-burgundy' : 'text-charcoal hover:text-burgundy'
                  }`}
                >
                  CATEGORY
                  <ChevronDown className="w-3 h-3" />
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg z-30">
                    <div className="py-1">
                      {safeCategories.length === 0 ? (
                        <span className="block px-4 py-2 text-xs text-gray-500">
                          No categories available
                        </span>
                      ) : (
                        safeCategories.map((category) => (
                          <button
                            key={category._id || category.slug}
                            type="button"
                            onClick={() => handleCategoryClick(category)}
                            className="block w-full text-left px-4 py-2 text-xs font-medium text-charcoal hover:text-burgundy hover:bg-ivory transition-colors"
                          >
                            {category.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/shop?salePrice=true" className={navLinkClass}>
                SALE
              </NavLink>
            </nav>
          </div>

          <Link to="/" className="font-heading text-2xl font-medium text-charcoal tracking-wider">
            {boutiqueName}
          </Link>

          <div className="flex items-center space-x-3 lg:space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-charcoal hover:text-burgundy transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/wishlist" className="relative text-charcoal hover:text-burgundy transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-burgundy text-ivory text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/account" className="text-charcoal hover:text-burgundy transition-colors">
              <User className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="relative text-charcoal hover:text-burgundy transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-charcoal text-ivory text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div ref={searchRef} className="py-3 border-t border-gray-200">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for silk sarees, lehengas..."
                className="flex-1 px-4 py-2 text-sm focus:outline-none bg-transparent"
                autoFocus
              />
              <button type="submit" className="text-charcoal hover:text-burgundy">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <NavLink
              to="/shop?newArrival=true"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium tracking-wider ${
                  isActive ? 'text-burgundy' : 'text-charcoal hover:text-burgundy'
                }`
              }
            >
              NEW ARRIVALS
            </NavLink>

            <button
              type="button"
              onClick={() => setMobileCategoryOpen((prev) => !prev)}
              className="flex items-center gap-2 w-full text-left py-3 text-sm font-medium tracking-wider text-charcoal hover:text-burgundy"
            >
              CATEGORY
              {mobileCategoryOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {mobileCategoryOpen && (
              <div className="pb-2">
                {safeCategories.length === 0 ? (
                  <span className="block px-6 py-2 text-xs text-gray-500">
                    No categories available
                  </span>
                ) : (
                  safeCategories.map((category) => (
                    <NavLink
                      key={category._id || category.slug}
                      to={`/category/${category.slug || slugify(category.name)}`}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileCategoryOpen(false);
                      }}
                      className={({ isActive }) =>
                        `block py-2 px-6 text-sm font-medium tracking-wider ${
                          isActive ? 'text-burgundy' : 'text-charcoal hover:text-burgundy'
                        }`
                      }
                    >
                      {category.name}
                    </NavLink>
                  ))
                )}
              </div>
            )}

            <NavLink
              to="/shop?salePrice=true"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-3 text-sm font-medium tracking-wider ${
                  isActive ? 'text-burgundy' : 'text-charcoal hover:text-burgundy'
                }`
              }
            >
              SALE
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
