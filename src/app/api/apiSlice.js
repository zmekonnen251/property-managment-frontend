import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const apiEndpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.REACT_APP_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: apiEndpoint,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    } else {
      headers.delete('authorization');
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.data?.accessToken) {
    Cookies.set('token', result?.data?.accessToken);
  }
  const { status } = result.meta.response;
  if (status === 401 || status === 403 || status === 404 || status === 405) {
    toast.error(result.error.data.message, {
      toastId: 'main-error-toast'
    });
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Guest',
    'Room',
    'Reservation',
    'Guest',
    'Employee',
    'RoomType',
    'Expense',
    'Hotel',
    'RentalRoom',
    'RentalRoomReservation',
    'RentalReservationReceipt',
    'Resident',
    'RoomTypeReservation',
    'Balance',
    'LastRentalRoomReservationReceipt',
    'HotelRentalRoom'
  ],
  endpoints: () => ({})
});
