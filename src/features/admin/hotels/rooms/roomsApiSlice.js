import { apiSlice } from 'app/api/apiSlice';

export const roomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchRoom: builder.query({
      query: (id) => `/rooms/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: 'Room', id }]
    }),
    createRoom: builder.mutation({
      query: (room) => ({
        url: '/rooms',
        method: 'POST',
        body: room
      }),
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: 'Room', id }],
      invalidatesTags: ['RoomType']
    }),
    updateRoom: builder.mutation({
      query: ({ id, data }) => ({
        url: `/rooms/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      transformResponse: (response) => response?.data,
      // TODO: fix invalidatesTags
      invalidatesTags: (result, error, id) => [{ type: 'Room', id }]
    }),
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: (result, error, id) => [
        { type: 'Room', id },
        { type: 'Room', id: 'PARTIAL-LIST' }
      ]
    }),
    fetchRoomTypes: builder.query({
      query: (id) => `hotels/${id}/room-types`,
      transformResponse: (response) => response?.data?.data,
      providesTags: (result = []) => ['RoomType', ...result.map(({ id }) => ({ type: 'RoomType', id }))]
    }),
    fetchRoomType: builder.query({
      query: (id) => `/room-types/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: 'RoomType', id }]
    }),
    fetchHotelRoomTypes: builder.query({
      query: (id) => `hotels/${id}/room-types`,
      transformResponse: (response) => response?.data?.data,
      providesTags: (result = []) => ['RoomType', ...result.map(({ id }) => ({ type: 'RoomType', id }))]
    }),

    createRoomType: builder.mutation({
      query: (roomType) => ({
        url: '/room-types',
        method: 'POST',
        type: 'multipart/form-data',
        body: roomType
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['RoomType', 'Room']
    }),

    updateRoomType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/room-types/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data',
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (result, error, arg) => [{ type: 'RoomType', id: arg.id }]
    }),
    fetchRoomTypeReservations: builder.query({
      query: (id) => `/room-types/${id}/reservations`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, id) => [{ type: 'RoomTypeReservation', id }]
    }),
    deleteRoomType: builder.mutation({
      query: (id) => ({
        url: `/room-types/${id}`,
        method: 'DELETE'
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (result, error, id) => [{ type: 'RoomType', id }]
    })
  })

  // Override the default baseQuery to use the custom fetch implementation
  // that adds the JWT token to the request headers
});

export const {
  useFetchHotelRoomTypesQuery,
  useFetchRoomQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useFetchRoomTypesQuery,
  useFetchRoomTypeQuery,
  useCreateRoomTypeMutation,
  useUpdateRoomTypeMutation,
  useDeleteRoomTypeMutation,
  useFetchRoomTypeReservationsQuery
} = roomsApiSlice;
