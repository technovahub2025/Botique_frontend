import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, Package, Calendar, MapPin, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import { formatPrice } from '../utils';
import api from '../services/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <p className="container mx-auto px-4 py-8">Loading...</p>;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/shop"
          className="inline-block bg-charcoal text-ivory px-6 py-3 rounded-md font-medium hover:bg-deep-brown transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const estimatedDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '3-7 business days';

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600">
          Thank you for your order. Your order number is{' '}
          <span className="font-bold text-charcoal">#{order.orderNumber}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Estimated Delivery
            </h3>
            <p className="text-gray-700">{estimatedDelivery}</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Shipping Address
            </h3>
            <p className="text-gray-700">
              {order.shippingAddress?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.addressLine1 || ''}{' '}
              {order.shippingAddress?.addressLine2 || ''}
              <br />
              {order.shippingAddress?.city || ''}, {order.shippingAddress?.state || ''} {order.shippingAddress?.postalCode || ''}
              <br />
              {order.shippingAddress?.country || ''}
              <br />
              Phone: {order.shippingAddress?.phone || 'N/A'}
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </h3>
            <p className="text-gray-700 capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
            <p className="text-sm text-gray-500">
              Status: <span className="capitalize">{order.paymentStatus}</span>
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {formatPrice((item.salePrice || item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4 space-y-2">
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
            <div className="flex justify-between items-center border-t pt-3 font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/account/orders"
          className="px-6 py-3 bg-charcoal text-ivory rounded-md font-medium hover:bg-deep-brown transition-colors text-center"
        >
          View My Orders
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-100 transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
