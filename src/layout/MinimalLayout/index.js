import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// project imports

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
  const auth = useAuth();
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate('/auth/login')
    }
  }, [location, auth.isLoggedIn])

  return (
    <>
      <Outlet />
    </>
  );
}

export default MinimalLayout;
