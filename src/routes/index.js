import { useRoutes } from 'react-router-dom';
import AuthenticationRoutes from './AuthenticationRoutes';
import ReceptionistRoutes from './ReceptionistRoutes';
import AdminRoutes from './AdminRoutes';
import NotFound from 'pages/NotFound';
import DefaultLayout from 'layout/DefaultLayout';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([
    AdminRoutes,
    ...ReceptionistRoutes,
    AuthenticationRoutes,
    {
      element: <DefaultLayout />,
      children: [
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ]);
}
