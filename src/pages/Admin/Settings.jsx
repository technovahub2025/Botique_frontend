import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Upload } from 'lucide-react';
import adminApi from '../../services/adminApi';

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      boutiqueName: 'Loom & Luster',
      email: 'hello@loomandluster.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, India',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    },
    orders: {
      orderPrefix: 'LL',
      autoConfirmOrder: false,
    },
    notifications: {
      newOrder: true,
      payment: true,
      lowStock: true,
      orderStatus: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminApi.get('/settings');
        if (res.data.success && res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await adminApi.put('/settings', settings);
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-charcoal text-ivory px-4 py-2 rounded-md font-medium hover:bg-deep-brown flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">{success}</div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Boutique Name</label>
              <input
                type="text"
                value={settings.general?.boutiqueName || ''}
                onChange={(e) => updateNested('general', 'boutiqueName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.general?.email || ''}
                onChange={(e) => updateNested('general', 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={settings.general?.phone || ''}
                onChange={(e) => updateNested('general', 'phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={settings.general?.currency || 'INR'}
                onChange={(e) => updateNested('general', 'currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={settings.general?.address || ''}
                onChange={(e) => updateNested('general', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Order Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Prefix</label>
              <input
                type="text"
                value={settings.orders?.orderPrefix || ''}
                onChange={(e) => updateNested('orders', 'orderPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.orders?.autoConfirmOrder || false}
                  onChange={(e) => updateNested('orders', 'autoConfirmOrder', e.target.checked)}
                  className="text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-700">Auto-confirm orders</span>
              </label>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.orders?.defaultStatus || false}
                  onChange={(e) => updateNested('orders', 'defaultStatus', e.target.checked)}
                  className="text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-700">Default status enabled</span>
              </label>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Settings;

