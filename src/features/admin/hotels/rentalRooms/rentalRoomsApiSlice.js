import { apiSlice } from 'app/api/apiSlice';

export const rentalRoomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotelRentalRooms: builder.query({
      query: (id) => `hotels/${id}/rental-rooms`,
      transformResponse: (response) => {
        return response?.data;
      },
      providesTags: [{ type: 'RentalRoom', id: 'LIST' }]
    }),
    getRentalRoom: builder.query({
      query: (id) => `/rental-rooms/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: 'RentalRoom', id }]
    }),
    createRentalRoom: builder.mutation({
      query: (body) => ({
        url: '/rental-rooms',
        method: 'POST',
        type: 'multipart/form-data', // 'application/json
        body
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['RentalRoom']
    }),
    updateRentalRoom: builder.mutation({
      query: ({ id, data }) => ({
        url: `/rental-rooms/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['RentalRoom']
    }),
    deleteRentalRoom: builder.mutation({
      query: (id) => ({
        url: `/rental-rooms/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['RentalRoom']
    })
    // getRentalRoomReservations: builder.query({
    // 	query: (id) => `/rental-rooms/${id}/rental-room-reservations`,
    // 	providesTags: (result) =>
    // 		result
    // 			? [
    // 					...result?.data?.map(({ _id }) => ({
    // 						type: 'RentalRoomReservation',
    // 						id: _id,
    // 					})),
    // 					{ type: 'RentalRoomReservation', id: 'LIST' },
    // 			  ]
    // 			: [{ type: 'RentalRoomReservation', id: 'LIST' }],
    // }),
  })
});
export const {
  useGetHotelRentalRoomsQuery,
  useGetRentalRoomQuery,
  useCreateRentalRoomMutation,
  useUpdateRentalRoomMutation,
  useDeleteRentalRoomMutation
} = rentalRoomsApiSlice;
