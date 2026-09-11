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
  Home,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useGoogleDriveStatus from '../hooks/useGoogleDriveStatus';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user: adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const { status, fetchStatus } = useGoogleDriveStatus();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/admin/products',
      label: 'Products',
      icon: Package,
    },
    {
      to: '/admin/categories',
      label: 'Categories',
      icon: Tag,
    },
    {
      to: '/admin/collections',
      label: 'Collections',
      icon: Layers,
    },
    {
      to: '/admin/orders',
      label: 'Orders',
      icon: ShoppingCart,
    },
    {
      to: '/admin/customers',
      label: 'Customers',
      icon: Users,
    },
    {
      to: '/admin/homepage',
      label: 'Homepage',
      icon: Home,
    },
    {
      to: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full overflow-y-auto flex flex-col">

          {/* Logo */}
          <div className="p-4 border-b">
            <Link
              to="/admin"
              className="text-xl font-heading font-bold text-charcoal"
            >
              Admin Panel
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1">
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

          {/* Bottom Sidebar Area */}
          <div className="border-t pt-4">

            {/* Google Drive Status */}
            <div className="px-4 py-2">

              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-gray-600" />


              {/* Connection Status */}
              <div className="flex items-center justify-between mb-3">

                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status.connected
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />

                  <span className="text-sm text-gray-700">
                    {status.loading
                      ? 'Checking...'
                      : status.connected
                      ? 'Connected'
                      : 'Not connected'}
                  </span>
                </div>

                {/* Refresh */}
                <button
                  type="button"
                  onClick={fetchStatus}
                  disabled={status.loading}
                  title="Refresh Google Drive status"
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-gray-500 ${
                      status.loading ? 'animate-spin' : ''
                    }`}
                  />
                </button>

              </div>

              {/* Account */}
              {status.connected && status.email && (
                <p className="text-xs text-gray-500 break-all mb-2">
                  {status.email}
                </p>
              )}

              {/* Folder */}
              {status.connected && (
                <div className="flex items-center gap-2 text-xs">
                  {status.folderAccessible ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-green-600">
                        Storage folder ready
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="text-red-600">
                        Storage folder unavailable
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Configuration warning */}
              {!status.configured && (
                <p className="text-xs text-red-600 mt-2">
                  Google Drive is not configured on the server.
                </p>
              )}

            </div>

            {/* Admin User */}
            <div className="px-4 py-2 border-t">
              <p className="text-sm font-medium text-gray-700">
                {adminUser?.name}
              </p>

              <p className="text-xs text-gray-500">
                {adminUser?.email}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md mx-2"
            >
              Sign Out
            </button>

          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:pl-64">

        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">

          <div className="flex items-center justify-between p-4">

            <div className="flex items-center gap-4">

              {/* Mobile Menu */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-600 hover:text-charcoal md:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <Link
                to="/admin"
                className="text-xl font-heading font-bold text-charcoal md:hidden"
              >
                Admin
              </Link>

            </div>

            {/* Google Drive Status */}
            <div className="flex items-center gap-2 text-sm">

              <span className="text-gray-600">
                Google Drive:
              </span>

              {status.loading ? (
                <span className="text-gray-500">
                  Checking...
                </span>
              ) : status.connected ? (
                <span className="flex items-center gap-1 text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Not connected
                </span>
              )}

              {/* Header refresh */}
              <button
                type="button"
                onClick={fetchStatus}
                disabled={status.loading}
                title="Refresh Google Drive status"
                className="ml-1 p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-gray-500 ${
                    status.loading ? 'animate-spin' : ''
                  }`}
                />
              </button>

            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-3 px-6 text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Loom & Luster Admin Panel
          </p>
        </footer>

      </div>

      {/* Mobile Overlay */}
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