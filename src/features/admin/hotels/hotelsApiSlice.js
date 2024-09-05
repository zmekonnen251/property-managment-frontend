import { apiSlice } from 'app/api/apiSlice';

export const hotelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => 'hotels',
      transformResponse: (response) => response?.data,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Hotel', id })), { type: 'Hotel', id: 'LIST' }] : [{ type: 'Hotel', id: 'LIST' }]
    }),
    getHotelRoomTypes: builder.query({
      query: (hotelId) => `hotels/${hotelId}/room-types`,
      transformResponse: (response) => response?.data?.data
    }),
    getHotel: builder.query({
      query: (hotelId) => `/hotels/${hotelId}`,
      transformResponse: (response) => {
        return response?.data;
      },
      providesTags: (result, error, id) => [{ type: 'Hotel', id }]
    }),
    createHotel: builder.mutation({
      query: (body) => ({
        url: '/hotels',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Hotel']
    }),
    updateHotel: builder.mutation({
      query: ({ hotelId, data }) => ({
        url: `hotels/${hotelId}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Hotel']
    }),
    deleteHotel: builder.mutation({
      query: (hotelId) => ({
        url: `hotels/${hotelId}`,
        method: 'DELETE'

        // invalidatesTags: [{ type: 'Hotel', id: 'LIST' }],
      }),
      invalidatesTags: ['Hotel']
    }),

    getRentalRooms: builder.query({
      query: (id) => `hotels/${id}/rental-rooms`,
      transformResponse: (response) => response?.data,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({
              type: 'RentalRoom',
              id
            })),
            { type: 'RentalRoom', id: 'LIST' }
          ]
          : [{ type: 'RentalRoom', id: 'LIST' }]
    }),
    getHotelRentalRoomReservations: builder.query({
      query: (id) => `hotels/${id}/rental-room-reservations`,
      transformResponse: (response) => response?.data,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({
              type: 'RentalRoomReservation',
              id
            })),
            { type: 'RentalRoomReservation', id: 'LIST' }
          ]
          : [{ type: 'RentalRoomReservation', id: 'LIST' }]
    }),
    getRentalReservationsReceipts: builder.query({
      query: (id) => `hotels/${id}/rental-room-reservations-receipts`,
      transformResponse: (response) => response?.data,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({
              type: 'RentalReservationReceipt',
              id
            })),
            { type: 'RentalReservationReceipt', id: 'LIST' }
          ]
          : [{ type: 'RentalReservationReceipt', id: 'LIST' }]
    }),
    getHotelRooms: builder.query({
      query: (id) => `hotels/${id}/rooms`,
      transformResponse: (response) => response?.data,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({
              type: 'Room',
              id
            })),
            { type: 'Room', id: 'LIST' }
          ]
          : [{ type: 'Room', id: 'LIST' }]
    }),
    getReservations: builder.query({
      query: (id) => `hotels/${id}/reservations`,
      transformResponse: (response) => response?.data,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({
              type: 'Reservation',
              id
            })),
            { type: 'Reservation', id: 'LIST' }
          ]
          : [{ type: 'Reservation', id: 'LIST' }]
    }),
    getHotelMonthlyRevenue: builder.query({
      query: ({ id, monthYear }) => `hotels/${id}/monthly-revenue?month=${monthYear.month}&year=${monthYear.year}`,
      transformResponse: (response) => response?.data
    }),
    getMonthlyHotelRentalRoomReservationReceipts: builder.query({
      query: ({ id, monthYear }) => `hotels/${id}/rental-room-reservations/monthly?month=${monthYear.month}&year=${monthYear.year}`,
      transformResponse: (response) => response?.data
    }),
    createCleanedRoomsNote: builder.mutation({
      query: ({ id, data }) => ({
        url: `hotels/${id}/cleaned-rooms`,
        method: 'POST',
        body: data
      })
    }),
    getCleanedRoomsNote: builder.query({
      query: (id) => `/hotels/${id}/cleaned-rooms`,
      transformResponse: (response) => response?.data
    })
  })
});

export const {
  useGetHotelsQuery,
  useGetHotelQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
  useGetHotelRoomTypesQuery,
  useGetRentalRoomsQuery,
  useGetRentalReservationsReceiptsQuery,
  useGetMonthlyHotelRentalRoomReservationReceiptsQuery,
  useGetHotelRoomsQuery,
  useGetReservationsQuery,
  useGetHotelMonthlyRevenueQuery,
  useCreateCleanedRoomsNoteMutation,
  useGetCleanedRoomsNoteQuery
} = hotelsApiSlice;
