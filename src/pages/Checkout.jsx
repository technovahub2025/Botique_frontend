import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, getEffectivePrice, calculateShipping, calculateTax } from '../utils';
import { getImageUrl } from '../services/imageUrl';
import api from '../services/api';

const DELIVERY_METHODS = [
  { id: 'standard', label: 'Standard Delivery', description: '5-7 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', description: '2-3 business days', price: 500 },
];

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your order' },
  { id: 'card', label: 'Credit / Debit Card', description: 'Mock - no real payment', disabled: true },
  { id: 'upi', label: 'UPI', description: 'Mock - no real payment', disabled: true },
  { id: 'netbanking', label: 'Net Banking', description: 'Mock - no real payment', disabled: true },
  { id: 'wallet', label: 'Wallet', description: 'Mock - no real payment', disabled: true },
];

const SHIPPING_THRESHOLD = 10000;

const steps = ['Customer Information', 'Shipping Address', 'Delivery & Payment'];

const CustomerInfoStep = ({ customerInfo, shippingAddress, setCustomerInfo, setShippingAddress }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">Full Name</label>
      <input
        type="text"
        value={customerInfo.name}
        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <input
        type="email"
        value={customerInfo.email}
        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Phone Number</label>
      <input
        type="tel"
        value={customerInfo.phone}
        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        required
      />
    </div>

    <div className="pt-4">
      <label className="block text-sm font-medium mb-1">Address Line 1</label>
      <input
        type="text"
        placeholder="Street address"
        value={shippingAddress.addressLine1}
        onChange={(e) => setShippingAddress((prev) => ({ ...prev, addressLine1: e.target.value, name: customerInfo.name, phone: customerInfo.phone }))}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
      <input
        type="text"
        placeholder="Apartment, floor, etc."
        value={shippingAddress.addressLine2}
        onChange={(e) => setShippingAddress((prev) => ({ ...prev, addressLine2: e.target.value, name: customerInfo.name, phone: customerInfo.phone }))}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <input
          type="text"
          value={shippingAddress.city}
          onChange={(e) => setShippingAddress((prev) => ({ ...prev, city: e.target.value, name: customerInfo.name, phone: customerInfo.phone }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <input
          type="text"
          value={shippingAddress.state}
          onChange={(e) => setShippingAddress((prev) => ({ ...prev, state: e.target.value, name: customerInfo.name, phone: customerInfo.phone }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Postal Code</label>
        <input
          type="text"
          value={shippingAddress.postalCode}
          onChange={(e) => setShippingAddress((prev) => ({ ...prev, postalCode: e.target.value, name: customerInfo.name, phone: customerInfo.phone }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <input
          type="text"
          value={shippingAddress.country}
          onChange={(e) => setShippingAddress((prev) => ({ ...prev, country: e.target.value, name: customerInfo.name, phone: customerInfo.phone }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          required
        />
      </div>
    </div>
  </div>
);

const DeliveryPaymentStep = ({
  deliveryMethod,
  paymentMethod,
  couponCode,
  discount,
  setDeliveryMethod,
  setPaymentMethod,
  handleCouponChange,
  handleApplyCoupon,
  couponMessage,
  loading,
  error,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold mb-3">Delivery Method</h3>
      <div className="space-y-2">
        {DELIVERY_METHODS.map((method) => (
          <label
            key={method.id}
            className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
              deliveryMethod === method.id ? 'border-gold bg-gold/5' : 'border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="deliveryMethod"
                value={method.id}
                checked={deliveryMethod === method.id}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="text-gold focus:ring-gold"
              />
              <div>
                <p className="font-medium">{method.label}</p>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
            <span className="text-sm font-medium">
              {method.price === 0 ? 'Free' : formatPrice(method.price)}
            </span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-3">Payment Method</h3>
      <div className="space-y-2">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={`flex items-center gap-3 p-3 border rounded-md ${
              method.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            } ${
              paymentMethod === method.id && !method.disabled
                ? 'border-gold bg-gold/5'
                : 'border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => !method.disabled && setPaymentMethod(e.target.value)}
              disabled={method.disabled}
              className="text-gold focus:ring-gold"
            />
            <div className="flex-1">
              <p className="font-medium">{method.label}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-2">Coupon Code <span className="text-xs text-gray-500 font-normal">(Optional)</span></h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={handleCouponChange}
          placeholder="Enter coupon code"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleApplyCoupon}
          disabled={loading || !couponCode.trim()}
          className="px-4 py-2 bg-charcoal text-ivory rounded-md hover:bg-deep-brown transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          <Tag className="w-4 h-4" />
          Apply
        </button>
      </div>
      {couponMessage && (
        <p className={`text-sm mt-2 ${couponMessage.includes('saved') ? 'text-green-600' : 'text-red-600'}`}>
          {couponMessage}
        </p>
      )}
    </div>

    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

const OrderSummary = ({
  items,
  subtotal,
  deliveryMethod,
  discount,
  getShippingDisplay,
  taxAmount,
  finalTotal,
  getEstimatedDelivery,
  handlePlaceOrder,
  loading,
  shippingAddress,
}) => (
  <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-8">
    <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>

    <div className="space-y-3 mb-4">
      {items.map((item) => {
        const price = getEffectivePrice(item.price, item.salePrice);
        const itemTotal = price * item.quantity;
        return (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
              {item.product?.images?.[0] && (
                <img
                  src={getImageUrl(item.product.images[0])}
                  alt={item.product?.name || 'Product'}
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.product?.name || 'Product unavailable'}</p>
              {item.selectedSize && <p className="text-xs text-gray-500">Size: {item.selectedSize}</p>}
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-medium">{formatPrice(itemTotal)}</span>
          </div>
        );
      })}
    </div>

    <div className="border-t pt-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping ({deliveryMethod === 'express' ? 'Express' : 'Standard'})</span>
        <span>{getShippingDisplay()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tax (12%)</span>
        <span>{formatPrice(taxAmount)}</span>
      </div>
      <div className="flex justify-between items-center border-t pt-3 mb-2 font-bold text-lg">
        <span>Total</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>
    </div>

    <div className="mb-4 p-3 bg-blue-50 rounded-md">
      <p className="text-xs text-blue-800">
        <strong>Estimated Delivery:</strong> {getEstimatedDelivery()}
      </p>
    </div>

    <button
      onClick={handlePlaceOrder}
      disabled={loading || !shippingAddress.addressLine1 || !shippingAddress.city}
      className="w-full bg-charcoal text-ivory py-3 rounded-md font-medium hover:bg-deep-brown transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          Place Order ({formatPrice(finalTotal)})
        </>
      )}
    </button>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, subtotal, shipping: cartShipping, tax: cartTax, clearCart, fetchCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-heading font-bold mb-4">Your cart is empty</h2>
        <Link
          to="/shop"
          className="inline-block bg-charcoal text-ivory px-6 py-3 rounded-md font-medium hover:bg-deep-brown transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const getShippingCost = () => {
    if (deliveryMethod === 'express') return 500;
    const effectiveSubtotal = subtotal - discount;
    return effectiveSubtotal >= SHIPPING_THRESHOLD ? 0 : 200;
  };

  const getShippingDisplay = () => {
    const cost = getShippingCost();
    return deliveryMethod === 'standard' && subtotal - discount >= SHIPPING_THRESHOLD
      ? 'Free'
      : formatPrice(cost);
  };

  const getEstimatedDelivery = () => {
    const date = new Date();
    if (deliveryMethod === 'express') {
      date.setDate(date.getDate() + 3);
    } else {
      date.setDate(date.getDate() + 7);
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const taxAmount = calculateTax(subtotal - discount + getShippingCost(), 0.12);
  const finalTotal = subtotal - discount + getShippingCost() + taxAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/coupons/validate/${couponCode.toUpperCase()}?subtotal=${subtotal}`);
      if (res.data && res.data.valid) {
        const { discount: couponDiscount } = res.data;
        setDiscount(couponDiscount);
        setAppliedCoupon(couponCode.toUpperCase());
        setCouponMessage(`Coupon applied! You saved ${formatPrice(couponDiscount)}`);
      } else {
        setCouponMessage('Invalid coupon code');
      }
    } catch (err) {
      setCouponMessage(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleCouponChange = (e) => {
    const value = e.target.value;
    setCouponCode(value);
    if (!value.trim()) {
      setCouponMessage('');
      setDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const orderData = {
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress,
        deliveryMethod,
        paymentMethod,
        notes: '',
        ...(appliedCoupon && { couponCode: appliedCoupon }),
      };

      const res = await api.post('/orders', orderData);

      if (res.data.success) {
        await clearCart();
        navigate(`/order-success/${res.data.order._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return customerInfo.name && customerInfo.email && customerInfo.phone && shippingAddress.addressLine1 && shippingAddress.city;
    }
    if (currentStep === 1) {
      return shippingAddress.addressLine1 && shippingAddress.city && shippingAddress.state && shippingAddress.postalCode;
    }
    return true;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold mb-6 fade-in">Checkout</h1>

      <div className="flex items-center justify-center mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-gold text-white'
                  : idx < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`ml-2 text-sm font-medium transition-colors ${
                idx === currentStep ? 'text-charcoal' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2 transition-transform duration-300" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300"
          style={{ animationDelay: '0.2s' }}
        >
          {currentStep === 0 && (
            <CustomerInfoStep
              customerInfo={customerInfo}
              shippingAddress={shippingAddress}
              setCustomerInfo={setCustomerInfo}
              setShippingAddress={setShippingAddress}
            />
          )}
          {currentStep === 1 && (
            <DeliveryPaymentStep
              deliveryMethod={deliveryMethod}
              paymentMethod={paymentMethod}
               couponCode={couponCode}
               discount={discount}
               setDeliveryMethod={setDeliveryMethod}
               setPaymentMethod={setPaymentMethod}
               handleCouponChange={handleCouponChange}
               handleApplyCoupon={handleApplyCoupon}
              couponMessage={couponMessage}
              loading={loading}
              error={error}
            />
          )}

          <div className="flex justify-between pt-6 border-t mt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-charcoal disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-2 bg-charcoal text-ivory rounded-md font-medium hover:bg-deep-brown transition-colors disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !canProceed()}
                className="px-6 py-2 bg-charcoal text-ivory rounded-md font-medium hover:bg-deep-brown transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Placing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            )}
          </div>
        </div>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          deliveryMethod={deliveryMethod}
          discount={discount}
          getShippingDisplay={getShippingDisplay}
          taxAmount={taxAmount}
          finalTotal={finalTotal}
          getEstimatedDelivery={getEstimatedDelivery}
          handlePlaceOrder={handlePlaceOrder}
          loading={loading}
          shippingAddress={shippingAddress}
        />
      </div>
    </div>
  );
};

export default Checkout;
