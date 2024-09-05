import { lazy } from 'react';

// project imports
import DefaultLayout from 'layout/DefaultLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRouteEmployee from 'features/authentication/ProtectedRouteEmployee';

const Hotels = Loadable(lazy(() => import('features/hotels/Hotels')));
const Reservations = Loadable(lazy(() => import('features/reservations/Reservations')));
const RoomTypes = Loadable(lazy(() => import('features/rooms/RoomTypes')));
const RentalReservations = Loadable(lazy(() => import('features/rentalReservations/RentalReservations')));
const RoomTypeReservations = Loadable(lazy(() => import('features/reservations/RoomTypeReservations')));
const EditReservation = Loadable(lazy(() => import('features/reservations/EditReservation')));
const RoomsPage = Loadable(lazy(() => import('pages/Rooms')));

import NewReservation from 'features/reservations/NewReservation';
import Hotel from 'features/hotels/Hotel';
import RoomTypeDetails from 'features/rooms/RoomTypeDetails';
import ReservationDetails from 'features/reservations/ReservationDetails';

const ReceptionistRoutes = [
  {
    path: '/', element: <DefaultLayout />,
    children: [{ index: true, element: <Hotels /> }]
  },
  {
    path: '/hotels',
    element: (
      <DefaultLayout>
        {' '}
        <ProtectedRouteEmployee />
      </DefaultLayout>
    ),
    children: [
      {
        index: true,
        element: <Hotels />
      },
      {
        path: ':id',
        children: [
          {
            path: 'rooms',
            element: <RoomsPage />
          },
          {
            index: true,
            element: <Hotel />
          },
          {
            path: 'reservations',
            children: [
              {
                index: true,
                element: <Reservations />
              },
              {
                path: 'new',
                element: <NewReservation />
              },
              {
                path: ':reservationId',
                element: <ReservationDetails />
              },
              {
                path: ':reservationId/edit',
                element: <EditReservation />
              }
            ]
          },
          {
            path: 'room-types',
            children: [
              {
                index: true,
                element: <RoomTypes />
              },
              {
                path: ':roomTypeId',
                element: <RoomTypeDetails />
              },
              {
                path: ':roomTypeId/reservations',
                element: <RoomTypeReservations />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    element: (
      <DefaultLayout>
        <ProtectedRouteEmployee />
      </DefaultLayout>
    ),
    children: [
      {
        path: '/rental-reservations',
        element: <RentalReservations />
      }
    ]
  }
];

export default ReceptionistRoutes;
