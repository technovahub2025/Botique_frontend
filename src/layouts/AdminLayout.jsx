import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  BarChart3,
  Ticket,
  FileText,
  Home,
  Box,
} from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Tag },
    { to: '/admin/collections', label: 'Collections', icon: Layers },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/inventory', label: 'Inventory', icon: Box },
    { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
    { to: '/admin/reviews', label: 'Reviews', icon: FileText },
    { to: '/admin/homepage', label: 'Homepage', icon: Home },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4 border-b">
            <Link to="/admin" className="text-xl font-heading font-bold text-charcoal">
              Admin Panel
            </Link>
          </div>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-charcoal text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="border-t pt-4 mt-auto">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-700">{adminUser?.name}</p>
              <p className="text-xs text-gray-500">{adminUser?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md mx-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:pl-64">
        <header className="bg-white shadow-sm sticky top-0 z-10 md:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-charcoal"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/admin" className="text-xl font-heading font-bold text-charcoal">
              Admin Panel
            </Link>
            <div className="w-6" />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        <footer className="bg-white border-t py-3 px-6 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Loom & Luster Admin Panel</p>
        </footer>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
