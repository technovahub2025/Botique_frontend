import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Tag, Check, X, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../utils';
import adminApi from '../../services/adminApi';

const COUPON_STATUSES = ['all', 'active', 'inactive'];
const DISCOUNT_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed Amount (₹)' },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    value: '',
    minOrder: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    perUserLimit: 1,
    active: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (search) params.set('search', search);
      const res = await adminApi.get(`/coupons?${params}`);
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        code: formData.code,
        description: formData.description || undefined,
        discountType: formData.discountType,
        value: Number(formData.value),
        minOrder: formData.minOrder ? Number(formData.minOrder) : 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : 1,
        active: formData.active,
      };

      if (editingCoupon) {
        await adminApi.put(`/coupons/${editingCoupon._id}`, payload);
      } else {
        await adminApi.post('/coupons', payload);
      }
      setSuccess(editingCoupon ? 'Coupon updated!' : 'Coupon created!');
      setTimeout(() => setSuccess(''), 3000);
      setShowModal(false);
      setEditingCoupon(null);
      setFormData({
        code: '', description: '', discountType: 'percentage', value: '',
        minOrder: '', maxDiscount: '', startDate: '', endDate: '',
        usageLimit: '', perUserLimit: 1, active: true,
      });
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      value: coupon.value,
      minOrder: coupon.minOrder || '',
      maxDiscount: coupon.maxDiscount || '',
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      perUserLimit: coupon.perUserLimit || 1,
      active: coupon.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await adminApi.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await adminApi.put(`/coupons/${coupon._id}`, { active: !coupon.active });
      fetchCoupons();
    } catch (err) {
      console.error('Failed to update coupon:', err);
    }
  };

  const filteredCoupons = search
    ? coupons.filter((c) => c.code?.toLowerCase().includes(search.toLowerCase()))
    : coupons;

  const getDiscountDisplay = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.value}% off`;
    }
    return `₹${coupon.value} off`;
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const expired = coupon.endDate ? now > new Date(coupon.endDate) : false;
    const limitReached = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;

    if (expired || limitReached) {
      return <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">Expired</span>;
    }
    if (coupon.active) {
      return <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
    }
    return <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Disabled</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Coupons</h1>
        <button
          onClick={() => { setShowModal(true); setEditingCoupon(null); setError(''); setSuccess(''); }}
          className="bg-charcoal text-ivory px-4 py-2 rounded-md font-medium hover:bg-deep-brown flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">{success}</div>}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coupons by code..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
      >
        {COUPON_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {loading ? (
        <p>Loading coupons...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium">Code</th>
                <th className="text-left p-3 font-medium">Discount</th>
                <th className="text-right p-3 font-medium">Min Order</th>
                <th className="text-right p-3 font-medium">Max Discount</th>
                <th className="text-center p-3 font-medium">Usage</th>
                <th className="text-center p-3 font-medium">Valid Dates</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No coupons found. Create your first coupon to get started.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b last:border-0">
                    <td className="p-3">
                      <div>
                        <span className="font-medium">{coupon.code}</span>
                        {coupon.description && (
                          <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{getDiscountDisplay(coupon)}</td>
                    <td className="p-3 text-right">{coupon.minOrder ? formatPrice(coupon.minOrder) : '—'}</td>
                    <td className="p-3 text-right">{coupon.maxDiscount ? formatPrice(coupon.maxDiscount) : '—'}</td>
                    <td className="p-3 text-center">
                      {coupon.usageLimit
                        ? `${coupon.usedCount}/${coupon.usageLimit}`
                        : `${coupon.usedCount} used`}
                    </td>
                    <td className="p-3 text-center text-xs">
                      {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : '—'}
                      <br />
                      to {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3 text-center">{getStatusBadge(coupon)}</td>
                    <td className="p-3">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => toggleActive(coupon)}
                          className="p-1 text-gray-600 hover:text-charcoal hover:bg-gray-100 rounded"
                          title={coupon.active ? 'Disable' : 'Enable'}
                        >
                          {coupon.active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="p-1 text-gray-600 hover:text-charcoal hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-heading font-bold mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Summer sale description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    required
                  >
                    {DISCOUNT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    min="0"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    min="1"
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                  <input
                    type="number"
                    value={formData.perUserLimit}
                    onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    min="1"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="text-gold focus:ring-gold"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCoupon(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-charcoal text-ivory rounded-md hover:bg-deep-brown disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : null}
                  {editingCoupon ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
