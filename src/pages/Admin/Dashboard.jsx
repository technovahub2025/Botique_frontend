import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { formatPrice, toArray } from '../../utils';
import adminApi from '../../services/adminApi';
import GoogleDriveCard from '../../components/Admin/GoogleDriveCard';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.get('/stats');
        if (res.data.success) {
          setStats(res.data.stats);
           setRecentOrders(toArray(res.data.recentOrders));
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) {
    return (
      <div>
        <h1 className="text-2xl font-heading font-bold mb-6">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mb-4">No dashboard data available.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: formatPrice(stats.totalSales),
      icon: LayoutDashboard,
      subtitle: 'All time revenue',
    },
    {
      title: 'Orders',
      value: (stats.totalOrders || 0).toString(),
      icon: ShoppingCart,
      subtitle: 'Total orders placed',
    },
    {
      title: 'Customers',
      value: (stats.totalCustomers || 0).toString(),
      icon: Users,
      subtitle: 'Registered accounts',
    },
    {
      title: 'Products',
      value: (stats.totalProducts || 0).toString(),
      icon: Package,
      subtitle: 'Active products',
    },
    {
      title: 'Pending Orders',
      value: (stats.pendingOrders || 0).toString(),
      icon: AlertCircle,
      subtitle: 'Awaiting confirmation',
    },
    {
      title: 'Low Stock',
      value: (stats.lowStockProducts || 0).toString(),
      icon: Package,
      subtitle: 'Below threshold',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-charcoal" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                  <p className="text-2xl font-bold text-charcoal">{card.value}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">{card.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold mb-3">Order Status Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(stats.ordersByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{count}</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {Math.round((count / stats.totalOrders) * 100) || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold mb-3 flex items-center justify-between">
            <span>Recent Orders</span>
            <Link
              to="/admin/orders"
              className="text-xs text-charcoal hover:text-deep-brown"
            >
              View All
            </Link>
          </h3>
          <div className="space-y-3">
            {recentOrders.length === 0 && <p className="text-sm text-gray-500">No recent orders</p>}
            {recentOrders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{formatPrice(order.total)}</p>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[order.orderStatus]}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <GoogleDriveCard />
      </div>
    </div>
  );
};

export default Dashboard;
