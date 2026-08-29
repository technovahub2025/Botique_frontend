import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import Loading from '../components/Loading';

const AdminRequireAuth = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  return <Outlet />;
};

export default AdminRequireAuth;
