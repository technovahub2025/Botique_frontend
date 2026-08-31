import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Package, Calendar, Clock, Check, Truck, FileText } from 'lucide-react';
import { formatPrice } from '../../utils';
import { getImageUrl } from '../../services/imageUrl';
import api from '../../services/api';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: Check },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: Check },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: Clock },
  returned: { label: 'Returned', color: 'bg-gray-100 text-gray-800', icon: Package },
};

const OrderStatusTimeline = ({ status, createdAt, updatedAt }) => {
  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(status) === -1 ? 0 : statuses.indexOf(status);

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Order Status</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_CONFIG[status]?.color || 'bg-gray-100 text-gray-800'}`}>
          {STATUS_CONFIG[status]?.label || status}
        </span>
        <span className="text-sm text-gray-500">
          Updated: {new Date(updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        {statuses.map((s, idx) => {
          const isCompleted = idx <= currentIndex && status !== 'cancelled' && status !== 'returned';
          const isCancelled = status === 'cancelled' || status === 'returned';
          const IconComponent = STATUS_CONFIG[s]?.icon || Clock;

          return (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCancelled && s === 'cancelled'
                    ? 'bg-red-500 text-white'
                    : isCancelled && s === 'returned'
                    ? 'bg-gray-500 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : idx === currentIndex
                    ? 'bg-gold text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-xs mt-1 text-gray-600 capitalize">{s}</span>
              {idx < statuses.length - 1 && (
                <div
                  className={`h-0.5 w-10 mt-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success && res.data.order) {
          setOrder(res.data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-4">Unable to load order</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/account/orders"
          className="inline-block bg-charcoal text-ivory px-6 py-3 rounded-md font-medium hover:bg-deep-brown transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold">Order #{order.orderNumber}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_CONFIG[order.orderStatus || 'pending']?.color || 'bg-gray-100 text-gray-800'}`}>
          {STATUS_CONFIG[order.orderStatus || 'pending']?.label || 'Pending'}
        </span>
      </div>

      <OrderStatusTimeline
        status={order.orderStatus || 'pending'}
        createdAt={order.createdAt}
        updatedAt={order.updatedAt}
      />

      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Order Items
        </h3>
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                {item.image && (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="max-w-full max-h-full object-cover rounded"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">
                {formatPrice((item.salePrice || item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <div className="text-sm space-y-1">
            <p className="font-medium">{order.shippingAddress?.name}</p>
            <p className="text-gray-600">{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>}
            <p className="text-gray-600">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </p>
            <p className="text-gray-600">{order.shippingAddress?.country}</p>
            <p className="text-gray-600">Phone: {order.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Payment Information</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-600">Method:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
            <p><span className="text-gray-600">Status:</span> {order.paymentStatus}</p>
            <p><span className="text-gray-600">Delivery:</span> {order.deliveryMethod}</p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (12%)</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between items-center border-t pt-2 font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
        {order.notes && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-gray-600"><strong>Notes:</strong> {order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
