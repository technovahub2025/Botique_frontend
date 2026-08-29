import { createContext, useEffect, useState, useCallback, useMemo } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.user.role === 'admin') {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          } else {
            setToken(storedToken);
            setUser(res.data.user);
          }
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;

    if (userData.role === 'admin') {
      throw new Error('Admin access is not available through customer login. Please use the admin login page.');
    }

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  }, []);

  const register = useCallback(async (name, email, phone, password) => {
    const res = await api.post('/auth/register', { name, email, phone, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
  }), [user, token, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
