import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';

const AdminRequireAuth = () => {
  const location = useLocation();
  const { user, token, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user || !token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const role = String(user?.role || '').toLowerCase();
  if (role !== 'admin') return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRequireAuth;
