import { apiSlice } from 'app/api/apiSlice';

export const guestsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchGuests: builder.query({
      query: () => '/guests',
      transformResponse: (response) => {
        return response.data;
      },
      provideTags: (result = []) => (result ? ['Guest', ...result.map(({ id }) => ({ type: 'Guest', id }))] : ['Guest'])
    }),
    fetchGuest: builder.query({
      query: (id) => `/guests/${id}`,
      provideTags: (arg) => [{ type: 'Guest', id: arg }]
    }),
    createGuest: builder.mutation({
      query: (data) => ({
        url: '/guests',
        method: 'POST',
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['Guest']
    }),
    updateGuest: builder.mutation({
      query: ({ id, data }) => ({
        url: `/guests/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (_result, _error, arg) => [{ type: 'Guest', id: arg.id }]
      // TODO: fix invalidatesTags
    }),
    deleteGuest: builder.mutation({
      query: (id) => ({
        url: `/guests/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: (_result, _error, arg) => [{ type: 'Guest', id: arg.id }]
    })
  })

  // Override the default baseQuery to use the custom fetch implementation
  // that adds the JWT token to the request headers
});

export const { useFetchGuestsQuery, useFetchGuestQuery, useCreateGuestMutation, useUpdateGuestMutation, useDeleteGuestMutation } =
  guestsApiSlice;
