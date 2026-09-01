export const formatPrice = (price) => {
  if (price == null || isNaN(price)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

export const calculateDiscount = (price, salePrice) => {
  if (!salePrice || !price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

export const getEffectivePrice = (price, salePrice) => {
  return salePrice || price;
};

export const calculateShipping = (subtotal, method = 'standard') => {
  if (subtotal >= 10000) return 0;
  return method === 'express' ? 500 : 200;
};

export const calculateTax = (amount, rate = 0.12) => {
  const tax = amount * rate;
  return Math.round(tax * 100) / 100;
};

export const debounce = (fn, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

export { toArray } from './toArray';
