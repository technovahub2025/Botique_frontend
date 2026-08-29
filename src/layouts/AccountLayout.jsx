import { NavLink, Outlet, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AccountLayout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/account', icon: User, label: 'Account Overview' },
    { to: '/account/orders', icon: Package, label: 'My Orders' },
    { to: '/account/addresses', icon: MapPin, label: 'Saved Addresses' },
    { to: '/account/payments', icon: CreditCard, label: 'Payment Methods' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-gray-600">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">{user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gold text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </nav>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
