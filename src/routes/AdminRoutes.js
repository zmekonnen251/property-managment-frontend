import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const RentalReceipts = Loadable(lazy(() => import('features/admin/hotels/rentalRoomReservations/RentalReceipts')));
import AdminHome from 'features/admin/pages/Home';
const ReservationDetailsAdmin = Loadable(lazy(() => import('features/admin/hotels/reservations/ReservationDetails')));
const EditEmployee = Loadable(lazy(() => import('features/admin/employees/EditEmployee')));
const Employees = Loadable(lazy(() => import('features/admin/employees/Employees')));
const Guests = Loadable(lazy(() => import('features/admin/guests/Guests')));
const HotelRooms = Loadable(lazy(() => import('features/admin/hotels/rooms/Rooms')));
const RentalRooms = Loadable(lazy(() => import('features/admin/hotels/rentalRooms/RentalRooms')));
const EditRentalRoom = Loadable(lazy(() => import('features/admin/hotels/rentalRooms/EditRentalRoom')));
const Balances = Loadable(lazy(() => import('features/admin/reports/Balances')));
const Reports = Loadable(lazy(() => import('features/admin/reports/Reports')));
const RoomTypesAdmin = Loadable(lazy(() => import('features/admin/hotels/rooms/RoomTypes')));
const EditRoomType = Loadable(lazy(() => import('features/admin/hotels/rooms/EditRoomType')));
const RentalReservationsReceipts = Loadable(
  lazy(() => import('features/admin/hotels/rentalRoomReservations/RentalRoomReservationReceipts'))
);
const ReservationsAdmin = Loadable(lazy(() => import('features/admin/hotels/reservations/Reservations')));
const EditReservationAdmin = Loadable(lazy(() => import('features/admin/hotels/reservations/EditReservation')));
import Hotels from 'features/admin/hotels/Hotels';
const EditHotel = Loadable(lazy(() => import('features/admin/hotels/EditHotel')));
const EditExpense = Loadable(lazy(() => import('features/admin/hotels/expenses/EditExpense')));
const HotelReport = Loadable(lazy(() => import('features/admin/hotels/report/Report')));
const Expenses = Loadable(lazy(() => import('features/admin/hotels/expenses/Expenses')));
const Drawings = Loadable(lazy(() => import('features/admin/hotels/expenses/Drawings')));

import RentalRoomReservations from 'features/admin/hotels/rentalRoomReservations/RentalRoomReservations';
import Residents from 'features/admin/residents/Residents';
import RentalRoomReservation from 'features/admin/hotels/rentalRoomReservations/RentalRoomReservation';
import NewRoom from 'features/admin/hotels/rooms/NewRoom';
import EmployeeDetails from 'features/admin/employees/EmployeeDetails';
import NewEmployee from 'features/admin/employees/NewEmployee';
import NewRentalRoom from 'features/admin/hotels/rentalRooms/NewRentalRoom';
import RentalRoom from 'features/admin/hotels/rentalRooms/RentalRoom';
import RentalRoomReservationsIncome from 'features/admin/hotels/rentalRoomReservations/RentalRoomReservationsIncome';
import NewRentalRoomReservation from 'features/admin/hotels/rentalRoomReservations/NewRentalRoomReservation';
import Hotel from 'features/admin/hotels/HotelDetails';
import NewHotel from 'features/admin/hotels/NewHotel';
import NewExpense from 'features/admin/hotels/expenses/NewExpense';
import Expense from 'features/admin/hotels/expenses/Expense';
import NewRoomType from 'features/admin/hotels/rooms/NewRoomType';
import RoomTypeDetailsAdmin from 'features/admin/hotels//rooms/RoomTypeDetails';
import NewReservation from 'features/reservations/NewReservation';
import CleanedRooms from 'features/admin/hotels/rooms/CleanedRooms';
import EditResident from 'features/admin/residents/EditResident';
import NewResident from 'features/admin/residents/NewResident';

const AdminRoutes = {
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <AdminHome />
    },
    {
      path: 'hotels',
      children: [
        {
          index: true,
          element: <Hotels />
        },
        {
          path: 'new-hotel',
          element: <NewHotel />
        },
        {
          path: ':id',
          children: [
            {
              index: true,
              element: <Hotel />
            },
            {
              path: 'edit',
              element: <EditHotel />
            },
            {
              path: 'report',
              element: <HotelReport />
            },
            {
              path: 'cleaned-rooms',
              element: <CleanedRooms />
            },
            {
              path: 'drawings',
              element: <Drawings />
            },
            {
              path: 'expenses',
              children: [
                {
                  index: true,
                  element: <Expenses />
                },

                {
                  path: 'new',
                  element: <NewExpense />
                },
                {
                  path: ':expenseId',
                  children: [
                    {
                      index: true,
                      element: <Expense />
                    },
                    {
                      path: 'edit',
                      element: <EditExpense />
                    }
                  ]
                }
              ]
            },
            {
              path: 'rooms',
              children: [
                {
                  index: true,
                  element: <HotelRooms />
                },
                {
                  path: 'new',
                  element: <NewRoom />
                }
              ]
            },
            {
              path: 'reservations',
              children: [
                {
                  index: true,
                  element: <ReservationsAdmin />
                },
                {
                  path: 'new',
                  element: <NewReservation />
                },
                {
                  path: ':reservationId',
                  element: <ReservationDetailsAdmin />
                },
                {
                  path: ':reservationId/edit',
                  element: <EditReservationAdmin />
                }
              ]
            },
            {
              path: 'rental-room-reservations',
              children: [
                {
                  index: true,
                  element: <RentalRoomReservations />
                },
                {
                  path: 'new',
                  element: <NewRentalRoomReservation />
                },
                {
                  path: ':reservationId',
                  children: [
                    {
                      index: true,
                      element: <RentalRoomReservation />
                    },

                    {
                      path: 'receipts',
                      element: <RentalReceipts />
                    }
                  ]
                }
              ]
            },
            {
              path: 'rental-income',
              element: <RentalRoomReservationsIncome />
            },
            {
              path: 'rental-room-reservations-receipts',
              children: [
                {
                  index: true,
                  element: <RentalReservationsReceipts />
                }
              ]
            },
            {
              path: 'rental-rooms',
              children: [
                {
                  index: true,
                  element: <RentalRooms />
                },

                {
                  path: 'new',
                  element: <NewRentalRoom />
                },
                {
                  path: ':rentalRoomId',
                  element: <RentalRoom />
                },
                {
                  path: ':rentalRoomId/edit',
                  element: <EditRentalRoom />
                }
              ]
            },

            {
              path: 'room-types',
              children: [
                {
                  index: true,
                  element: <RoomTypesAdmin />
                },
                {
                  path: 'new',
                  element: <NewRoomType />
                },
                {
                  path: ':roomTypeId',
                  element: <RoomTypeDetailsAdmin />
                },
                {
                  path: ':roomTypeId/edit',
                  element: <EditRoomType />
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: 'employees',
      children: [
        {
          index: true,
          element: <Employees />
        },
        {
          path: 'new-employee',
          element: <NewEmployee />
        },
        {
          path: ':id',
          element: <EmployeeDetails />
        },
        {
          path: ':id/edit',
          element: <EditEmployee />
        }
      ]
    },
    {
      path: 'guests',
      element: <Guests />
    },
    {
      path: 'residents',
      children: [
        {
          index: true,
          element: <Residents />
        },
        {
          path: 'new-resident',
          element: <NewResident />
        },
        {
          path: ':residentId/edit',
          element: <EditResident />
        }
      ]
    },

    {
      path: 'reports',
      children: [
        {
          index: true,
          element: <Reports />
        },
        {
          path: 'balances',
          children: [
            {
              index: true,
              element: <Balances />
            }
          ]
        }
      ]
    }
  ]
};

export default AdminRoutes;
