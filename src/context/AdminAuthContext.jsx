import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import adminApi from '../services/adminApi';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setAdminToken(null);
      setAdminUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await adminApi.get('/auth/me');
      if (res.data.success && res.data.user.role === 'admin') {
        setAdminToken(token);
        setAdminUser(res.data.user);
      } else {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
        setAdminUser(null);
      }
    } catch {
      localStorage.removeItem('adminToken');
      setAdminToken(null);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handleAdminLogout = () => {
      setAdminToken(null);
      setAdminUser(null);
    };
    window.addEventListener('admin:logout', handleAdminLogout);
    return () => {
      window.removeEventListener('admin:logout', handleAdminLogout);
    };
  }, [checkAuth]);

  const adminLogin = async (email, password) => {
    const res = await adminApi.post('/auth/login', { email, password });
    if (!res.data.success) {
      throw new Error(res.data.message || 'Login failed');
    }

    if (res.data.user.role !== 'admin') {
      throw new Error('Access denied. Admin role required.');
    }

    localStorage.setItem('adminToken', res.data.token);
    setAdminToken(res.data.token);
    setAdminUser(res.data.user);
    return res.data;
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdminUser(null);
  };

  const value = useMemo(() => ({
    adminToken,
    adminUser,
    loading,
    adminLogin,
    adminLogout,
    isAuthenticated: !!adminToken && !!adminUser,
  }), [adminToken, adminUser, loading, adminLogin, adminLogout]);

  return (
    <AdminAuthContext.Provider value={value}>
      <Outlet />
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
