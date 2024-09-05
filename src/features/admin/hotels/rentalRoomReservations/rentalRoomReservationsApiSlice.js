import { apiSlice } from 'app/api/apiSlice';

export const rentalRoomReservationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRentalRoomReservations: builder.query({
      query: () => '/rental-room-reservations',

      transformResponse: (response) => response?.data,

      providesTags: (result = []) => [
        'RentalRoomReservation',
        ...result.map(({ id }) => ({
          type: 'RentalRoomReservation',
          id
        }))
      ]
    }),
    getHotelRentalRoomReservations: builder.query({
      query: (id) => `hotels/${id}/rental-room-reservations`,

      transformResponse: (response) => {
        return response.data;
      },

      providesTags: (result = []) => [
        'RentalRoomReservation',
        ...result.map(({ id }) => ({
          type: 'RentalRoomReservation',
          id
        }))
      ]
    }),
    getRentalRoomReservationReceipts: builder.query({
      query: ({ id, reservationId }) => `hotels/${id}/rental-room-reservations/${reservationId}/receipts`,
      transformResponse: (response) => response?.data,
      providesTags: (result = []) => [
        'RentalRoomReservationReceipt',
        ...result.map(({ id }) => ({
          type: 'RentalRoomReservationReceipt',
          id
        }))
      ]
    }),
    getLatestRentalReservationReceipt: builder.query({
      query: (id) => `/rental-room-reservations/${id}/latest-receipt`,
      transformResponse: (response) => response?.data
    }),
    getHotelMonthlyRentalRoomReservations: builder.query({
      query: ({ id, monthYear }) => `/hotels/${id}/rental-room-reservations/monthly-new?month=${monthYear.month}&year=${monthYear.year}`,
      transformResponse: (response) => {
        return response.data;
      }
    }),
    getRentalRoomReservation: builder.query({
      query: (id) => `/rental-room-reservations/${id}`,
      transformResponse: (response) => response?.data
    }),
    createRentalRoomReservation: builder.mutation({
      query: (body) => ({
        url: '/rental-room-reservations',
        method: 'POST',
        type: 'multipart/form-data', // 'application/json
        body
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['RentalRoomReservation', 'HotelRentalRoom']
    }),
    updateUnpaidRentalRoomReservation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/rental-room-reservations/${id}/unpaid`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (result, error, arg) => [{ type: 'RentalRoomReservation', id: arg.id }, 'LastRentalRoomReservationReceipt']
    }),

    deleteRentalRoomReservation: builder.mutation({
      query: (id) => ({
        url: `/rental-room-reservations/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['RentalRoomReservation']
    }),

    renewRentalRoomReservation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/rental-room-reservations/${id}/renew`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      invalidatesTags: ['RentalRoomReservation']
    }),

    getHotelRentalRoomReservationReceipts: builder.query({
      query: (id) => `/hotels/${id}/rental-room-reservations/receipts`,

      transformResponse: (response) => {
        return response.data;
      },

      providesTags: (result = []) => [
        'RentalRoomReservationReceipt',
        ...result.map(({ id }) => ({
          type: 'RentalRoomReservationReceipt',
          id
        }))
      ]
    }),
    getRentalRoomReservationReceipt: builder.query({
      query: (id) => `/rental-room-reservations/receipts/${id}`
    }),
    sendRentalRoomReservationConfirmationEmail: builder.mutation({
      query: (id) => ({
        url: `/rental-room-reservations/${id}/send-confirmation-email`,
        method: 'POST'
      })
    }),
    checkOutRentalReservation: builder.mutation({
      query: (id) => ({
        url: `/rental-room-reservations/${id}/check-out`,
        method: 'PATCH'
      }),
      invalidatesTags: ['RentalRoomReservation', 'RentalRoom']
    })
  })
});

export const {
  useGetLatestRentalReservationReceiptQuery,
  useGetRentalRoomReservationsQuery,
  useGetHotelRentalRoomReservationsQuery,
  useGetRentalRoomReservationQuery,
  useCreateRentalRoomReservationMutation,
  useDeleteRentalRoomReservationMutation,
  useRenewRentalRoomReservationMutation,
  useGetRentalRoomReservationReceiptsQuery,
  useGetHotelRentalRoomReservationReceiptsQuery,
  useGetRentalRoomReservationReceiptQuery,
  useUpdateUnpaidRentalRoomReservationMutation,
  useSendRentalRoomReservationConfirmationEmailMutation,
  useGetHotelMonthlyRentalRoomReservationsQuery,
  useCheckOutRentalReservationMutation
} = rentalRoomReservationsApiSlice;
