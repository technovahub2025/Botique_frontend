import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from './Loading';

const RequireAuth = ({ admin = false }) => {
  const location = useLocation();
  const { user, token, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (admin && String(user?.role || '').toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (!admin && String(user?.role || '').toLowerCase() === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
