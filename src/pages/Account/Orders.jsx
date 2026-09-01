import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ChevronRight } from 'lucide-react';
import { formatPrice, toArray } from '../../utils';
import { getImageUrl } from '../../services/imageUrl';
import api from '../../services/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
         setOrders(toArray(res.data, ['orders']));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-3">
                <div className="h-5 bg-gray-200 rounded w-32" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center fade-in">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-4">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
        <Link
          to="/shop"
          className="inline-block bg-charcoal text-ivory px-6 py-3 rounded-md font-medium hover:bg-deep-brown transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-2xl font-heading font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${STATUS_COLORS[order.orderStatus || 'pending']}`}>
                {(order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1)}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              {order.items?.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                    {item.image && (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="max-w-full max-h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice((item.salePrice || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
              {(order.items?.length || 0) > 3 && (
                <p className="text-xs text-gray-500">+{order.items.length - 3} more item(s)</p>
              )}
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
                <span>
                  Status: {order.paymentStatus}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">{formatPrice(order.total)}</span>
                <Link
                  to={`/account/orders/${order._id}`}
                  className="text-charcoal hover:text-deep-brown text-sm font-medium flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
