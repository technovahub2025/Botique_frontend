import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Account = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-2xl font-heading font-bold mb-6">My Account</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-600">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-lg">{user?.name || 'Guest'}</p>
            <p className="text-gray-600">{user?.email || 'N/A'}</p>
            <p className="text-sm text-gray-500">Role: {user?.role || 'customer'}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <Link
            to="/account/orders"
            className="text-left w-full py-2 text-gray-700 hover:text-burgundy"
          >
            My Orders
          </Link>
          <button className="text-left w-full py-2 text-gray-700 hover:text-burgundy">
            Saved Addresses
          </button>
          <button className="text-left w-full py-2 text-gray-700 hover:text-burgundy">
            Payment Methods
          </button>
          <button
            onClick={logout}
            className="text-left w-full py-2 text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
