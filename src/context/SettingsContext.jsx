import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
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
    autoConfirmOrder: true,
    defaultStatus: 'pending',
  },
  inventory: {
    lowStockThreshold: 5,
    notifyLowStock: false,
    allowBackorder: false,
  },
  notifications: {
    newOrder: true,
    payment: true,
    lowStock: false,
    orderStatus: true,
  },
  security: {
    jwtExpiresIn: '30d',
    sessionTimeout: 0,
    twoFactorAuth: false,
  },
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
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

  const value = useMemo(
    () => ({
      settings: settings || DEFAULT_SETTINGS,
      loading,
      boutiqueName: settings?.general?.boutiqueName || DEFAULT_SETTINGS.general.boutiqueName,
      email: settings?.general?.email || DEFAULT_SETTINGS.general.email,
      phone: settings?.general?.phone || DEFAULT_SETTINGS.general.phone,
      address: settings?.general?.address || DEFAULT_SETTINGS.general.address,
      currency: settings?.general?.currency || DEFAULT_SETTINGS.general.currency,
      timezone: settings?.general?.timezone || DEFAULT_SETTINGS.general.timezone,
    }),
    [settings, loading]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const settingsUtils = {
  formatPrice: (amount, currency = 'INR') => {
    if (amount === null || amount === undefined) return '';
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return '';
    if (currency === 'INR') {
      return `₹${numAmount.toLocaleString('en-IN')}`;
    }
    return `${numAmount.toFixed(2)}`;
  },
};

export default SettingsContext;
