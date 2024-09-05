import MinimalLayout from 'layout/MinimalLayout';
import AuthLogin3 from 'views/pages/authentication/authentication3/Login3';
import ForgotPassword from 'views/pages/authentication/authentication3/ForgotPassword';
import ResetPassword from 'views/pages/authentication/authentication3/ResetPassword';

const AuthenticationRoutes = {
  path: '/auth',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin3 />
    },
    {
      path: 'reset-password/:token',
      element: <ResetPassword />
    },
    {
      path: 'forgot-password',
      element: <ForgotPassword />
    }
  ]
};

export default AuthenticationRoutes;
