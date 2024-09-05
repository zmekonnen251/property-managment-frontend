import { Navigate, Outlet, useLocation, useMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from 'hooks/useAuth';

const ProtectedRouteEmployee = ({ employeeRole }) => {
  const { isLoggedIn, role, hotels } = useAuth();
  const location = useLocation();
  //write a regex that match the path which starts with /hotels/ and then any character
  let hotelId;
  if (location.pathname?.match(/\/hotels\/(.*)/)) {
    hotelId = parseInt(location.pathname?.match(/\/hotels\/(.*)/)[0]?.split('/')[2]);
  }

  // const match3 = location.pathname.match(/\/rooms\/(.*)/);
  const match4 = useMatch('/hotels/:id/rooms');

  if (location.pathname === '/rental-reservations') {
    if (isLoggedIn && (role === 'careTaker' || role === 'receptionist' || role === 'admin' || role === 'manager')) {
      return <Outlet />;
    } else {
      toast.error('You are not authorized to access this page!', {
        position: 'top-center',
        toastId: 'protected-route-employee'
      });

      return <Navigate to="/auth/login" state={{ from: location.pathname }} />;
    }
  }

  if (match4) {
    if (isLoggedIn && (role === 'cleaner' || role === 'admin' || role === 'manager')) {
      return <Outlet />;
    } else {
      toast.error('You are not authorized to access this page!', {
        position: 'top-center',
        toastId: 'protected-route-employee'
      });

      return <Navigate to="/auth/login" state={{ from: location.pathname }} />;
    }
  }

  if (hotelId) {
    if (
      isLoggedIn &&
      (employeeRole !== 'admin' || employeeRole !== 'manager') &&
      employeeRole === 'receptionist' &&
      !hotels?.includes(hotelId)
    ) {
      toast.error('You are not authorized to access this page!', {
        position: 'top-center',
        toastId: 'protected-route-employee'
      });
    } else if (isLoggedIn && hotels.includes(hotelId) && role === 'receptionist') {
      return <Outlet />;
    } else if (isLoggedIn && (role === 'admin' || role === 'manager')) {
      return <Outlet />;
    } else {
      toast.error('You are not authorized to access this page!', {
        position: 'top-center',
        toastId: 'protected-route-employee'
      });

      return <Navigate to="/auth/login" state={{ from: location.pathname }} />;
    }
  }
};

export default ProtectedRouteEmployee;
