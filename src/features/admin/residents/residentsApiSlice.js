import { apiSlice } from 'app/api/apiSlice';

export const residentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchResidents: builder.query({
      query: () => '/residents',
      transformResponse: (response) => {
        return response.data;
      },
      provideTags: (result = []) => (result ? ['Resident', ...result.map(({ id }) => ({ type: 'Resident', id }))] : ['Resident'])
    }),
    fetchResident: builder.query({
      query: (id) => `/residents/${id}`,
      transformResponse: (response) => response.data,
      provideTags: (arg) => [{ type: 'Resident', id: arg }]
    }),
    createResident: builder.mutation({
      query: (data) => ({
        url: '/residents',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Resident']
    }),
    updateResident: builder.mutation({
      query: ({ id, data }) => ({
        url: `/residents/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (_result, _error, arg) => [{ type: 'Resident', id: arg.id }]
    }),
    deleteResident: builder.mutation({
      query: (id) => ({
        url: `/residents/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['Resident']
    })
  })

  // Override the default baseQuery to use the custom fetch implementation
  // that adds the JWT token to the request headers
});

export const {
  useFetchResidentsQuery,
  useFetchResidentQuery,
  useCreateResidentMutation,
  useUpdateResidentMutation,
  useDeleteResidentMutation
} = residentsApiSlice;
