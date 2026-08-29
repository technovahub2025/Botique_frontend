import { createContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { getEffectivePrice, calculateShipping, calculateTax } from '../utils';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'loom-and-luster-cart';
const SHIPPING_THRESHOLD = 10000;
const TAX_RATE = 0.12;

const getLocalCart = () => {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  try {
    const parsed = JSON.parse(saved || '[]');
    return parsed.map((item) => ({
      ...item,
      id: `${item.product._id}-${item.selectedSize || ''}`,
    }));
  } catch {
    return [];
  }
};

const setLocalCart = (items) => {
  const storageItems = items.map(({ id, ...rest }) => rest);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storageItems));
};

const normalizeBackendItems = (items) =>
  (items || []).map((item) => ({
    id: item._id,
    product: item.product,
    quantity: item.quantity,
    price: item.price,
    salePrice: item.salePrice,
    selectedSize: item.size || null,
    selectedColor: item.color || null,
  }));

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    totalPrice: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const isAuthed = !!token;

  const syncTotalsFromBackend = useCallback((cart) => {
    setTotals({
      subtotal: cart.subtotal || 0,
      shipping: cart.shipping || 0,
      tax: cart.tax || 0,
      totalPrice: cart.total || 0,
      itemCount: cart.itemCount || 0,
    });
  }, []);

  const fetchCart = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/cart');
      const cart = res.data.cart;
      setItems(normalizeBackendItems(cart.items));
      syncTotalsFromBackend(cart);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load cart');
      setItems([]);
      setTotals({ subtotal: 0, shipping: 0, tax: 0, totalPrice: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [isAuthed, syncTotalsFromBackend]);

  useEffect(() => {
    if (isAuthed) {
      const localItems = getLocalCart();
      const mergeAndFetch = async () => {
        if (localItems.length > 0) {
          for (const item of localItems) {
            try {
              await api.post('/cart', {
                productId: item.product._id,
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor,
              });
            } catch (err) {
              console.error('Failed to merge cart item:', err);
            }
          }
          localStorage.removeItem(CART_STORAGE_KEY);
        }
        fetchCart();
      };
      mergeAndFetch();
    } else {
      const localItems = getLocalCart();
      setItems(localItems);
    }
  }, [isAuthed, fetchCart]);

  useEffect(() => {
    if (!isAuthed) {
      setLocalCart(items);
      const subtotal = items.reduce(
        (sum, item) =>
          sum + getEffectivePrice(item.price, item.salePrice) * item.quantity,
        0
      );
      const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : calculateShipping(subtotal);
      const tax = calculateTax(subtotal, TAX_RATE);
      const totalPrice = subtotal + shipping + tax;
      setTotals({
        subtotal,
        shipping,
        tax,
        totalPrice,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      });
    }
  }, [items, isAuthed]);

  const addItem = useCallback(
    async (product, quantity = 1, selectedSize = null, selectedColor = null) => {
      if (isAuthed) {
        try {
          const res = await api.post('/cart', {
            productId: product._id,
            quantity,
            size: selectedSize,
            color: selectedColor,
          });
          const cart = res.data.cart;
          setItems(normalizeBackendItems(cart.items));
          syncTotalsFromBackend(cart);
          return cart;
        } catch (err) {
          console.error('Failed to add to cart:', err);
          setError(err.response?.data?.message || err.message || 'Failed to add to cart');
          throw err;
        }
      } else {
        setItems((prev) => {
          const existing = prev.find(
            (item) => item.product._id === product._id && item.selectedSize === selectedSize
          );
          if (existing) {
            return prev.map((item) =>
              item.product._id === product._id && item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [
            ...prev,
            {
              id: `${product._id}-${selectedSize || ''}`,
              product,
              quantity,
              selectedSize,
            },
          ];
        });
        return null;
      }
    },
    [isAuthed, syncTotalsFromBackend]
  );

  const removeItem = useCallback(
    async (itemId) => {
      if (isAuthed) {
        setUpdatingIds((prev) => new Set(prev).add(itemId));
        try {
          const res = await api.delete(`/cart/item/${itemId}`);
          const cart = res.data.cart;
          setItems(normalizeBackendItems(cart.items));
          syncTotalsFromBackend(cart);
        } catch (err) {
          console.error('Failed to remove item:', err);
          setError(err.response?.data?.message || err.message || 'Failed to remove item');
        } finally {
          setUpdatingIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }
      } else {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    },
    [isAuthed, syncTotalsFromBackend]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }
      if (isAuthed) {
        setUpdatingIds((prev) => new Set(prev).add(itemId));
        try {
          const res = await api.put(`/cart/item/${itemId}`, { quantity });
          const cart = res.data.cart;
          setItems(normalizeBackendItems(cart.items));
          syncTotalsFromBackend(cart);
        } catch (err) {
          console.error('Failed to update quantity:', err);
          setError(err.response?.data?.message || err.message || 'Failed to update quantity');
        } finally {
          setUpdatingIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
        );
      }
    },
    [isAuthed, removeItem, syncTotalsFromBackend]
  );

  const clearCart = useCallback(async () => {
    if (isAuthed) {
      try {
        const res = await api.delete('/cart');
        const cart = res.data.cart;
        setItems([]);
        syncTotalsFromBackend(cart);
      } catch (err) {
        console.error('Failed to clear cart:', err);
        setError(err.response?.data?.message || err.message || 'Failed to clear cart');
      }
    } else {
      setItems([]);
    }
  }, [isAuthed, syncTotalsFromBackend]);

  const getItemQuantity = useCallback(
    (productId) => {
      return items
        .filter((item) => item.product && item.product._id === productId)
        .reduce((sum, item) => sum + item.quantity, 0);
    },
    [items]
  );

  const totalItems = totals.itemCount;

  return (
    <CartContext.Provider
      value={{
        items,
        cartTotals: totals,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        totalItems,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        totalPrice: totals.totalPrice,
        loading,
        updatingIds,
        error,
        clearError: () => setError(null),
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
