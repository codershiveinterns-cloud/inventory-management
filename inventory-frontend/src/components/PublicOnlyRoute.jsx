import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PublicOnlyRoute() {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? '/app'} replace />;
  }

  return <Outlet />;
}
