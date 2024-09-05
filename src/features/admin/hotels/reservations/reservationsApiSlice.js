import { apiSlice } from 'app/api/apiSlice';

export const reservationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchReservations: builder.query({
      query: () => '/reservations',
      transformResponse: (response) => response?.data,
      providesTags: (result = []) => ['Reservation', ...result.map(({ id }) => ({ type: 'Reservation', id }))]
    }),
    fetchHotelReservations: builder.query({
      query: (id) => `hotels/${id}/reservations`,
      transformResponse: (response) => response?.data,
      providesTags: (result = []) => ['Reservation', ...result.map(({ id }) => ({ type: 'Reservation', id }))]
    }),
    fetchReservation: builder.query({
      query: (id) => `/reservations/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, arg) => [{ type: 'Reservation', id: arg }]
    }),
    createReservation: builder.mutation({
      query: (data) => ({
        url: '/reservations',
        method: 'POST',
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidateTags: ['Reservation']
    }),
    updateReservation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reservations/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Reservation', id: arg.id }]

      // TODO: fix invalidatesTags
    }),
    deleteReservation: builder.mutation({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Reservation']
    }),
    getMonthlyStats: builder.query({
      query: () => '/reservations/monthly-stats'
    }),
    getLatestReservations: builder.query({
      query: () => '/reservations/latest-reservations',
      transformResponse: (response) => response?.data
    }),
    getTodaysReservations: builder.query({
      query: (id) => `/hotels/${id}/reservations/todays-reservations`,
      transformResponse: (response) => response?.data
    }),
    getDailyReservations: builder.query({
      query: ({ id, monthYear }) => `/hotels/${id}/reservations/daily?month=${monthYear.month}&year=${monthYear.year}&day=${monthYear.day}`,
      transformResponse: (response) => response?.data
    }),
    sendReservationConfirmationEmail: builder.mutation({
      query: (id) => ({
        url: `/reservations/${id}`,
        method: 'POST'
      })
    }),
    checkOutReservation: builder.mutation({
      query: (id) => ({
        url: `/reservations/${id}/checkout`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Reservation', id: arg.id }]
    })
  })
});

export const {
  useFetchHotelReservationsQuery,
  useFetchReservationsQuery,
  useFetchReservationQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useDeleteReservationMutation,
  useGetMonthlyStatsQuery,
  useGetLatestReservationsQuery,
  useCheckOutReservationMutation,
  useSendReservationConfirmationEmailMutation,
  useGetTodaysReservationsQuery,
  useGetDailyReservationsQuery
} = reservationsApiSlice;
