import { createContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext();

const WISHLIST_STORAGE_KEY = 'loom-and-luster-wishlist';
const CART_STORAGE_KEY = 'loom-and-luster-cart';

const getLocalWishlist = () => {
  const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
  try {
    return JSON.parse(saved || '[]');
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAuthed = !!token;

  const normalizeBackendItems = (wishlistItems) =>
    (wishlistItems || []).map((item) => item.product);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setItems(normalizeBackendItems(res.data.wishlist.items));
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    if (isAuthed) {
      fetchWishlist();
    } else {
      setItems(getLocalWishlist());
    }
  }, [isAuthed, fetchWishlist]);

  useEffect(() => {
    if (!isAuthed) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isAuthed]);

  const addItem = useCallback(
    async (product) => {
      if (isAuthed) {
        const res = await api.post('/wishlist', { productId: product._id });
        setItems(normalizeBackendItems(res.data.wishlist.items));
      } else {
        setItems((prev) => {
          if (prev.some((item) => item._id === product._id)) return prev;
          return [...prev, product];
        });
      }
    },
    [isAuthed]
  );

  const removeItem = useCallback(
    async (productId) => {
      if (isAuthed) {
        const res = await api.delete(`/wishlist/${productId}`);
        setItems(normalizeBackendItems(res.data.wishlist.items));
      } else {
        setItems((prev) => prev.filter((item) => item._id !== productId));
      }
    },
    [isAuthed]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (isAuthed) {
        try {
          const res = await api.post('/wishlist', { productId: product._id });
          setItems(normalizeBackendItems(res.data.wishlist.items));
        } catch (err) {
          if (err.response?.status === 400) {
            const res = await api.delete(`/wishlist/${product._id}`);
            setItems(normalizeBackendItems(res.data.wishlist.items));
          }
        }
      } else {
        setItems((prev) => {
          if (prev.some((item) => item._id === product._id)) {
            return prev.filter((item) => item._id !== product._id);
          }
          return [...prev, product];
        });
      }
    },
    [isAuthed]
  );

  const isInWishlist = useCallback(
    (productId) => {
      return items.some((item) => item._id === productId);
    },
    [items]
  );

  const moveToCart = useCallback(
    async (product, quantity = 1, size = null, color = null) => {
      if (isAuthed) {
        const res = await api.post('/wishlist/move-to-cart', {
          productId: product._id,
          quantity,
          size,
          color,
        });
        setItems(normalizeBackendItems(res.data.wishlist.items));
        return res.data.cart;
      } else {
        const cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        cart.push({
          id: `${product._id}-${size || ''}`,
          product,
          quantity,
          selectedSize: size,
        });
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

        setItems((prev) => prev.filter((item) => item._id !== product._id));
        return null;
      }
    },
    [isAuthed]
  );

  const clearWishlist = useCallback(async () => {
    if (isAuthed) {
      for (const product of items) {
        await api.delete(`/wishlist/${product._id}`);
      }
      setItems([]);
    } else {
      setItems([]);
    }
  }, [isAuthed, items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
