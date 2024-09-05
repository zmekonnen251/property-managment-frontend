import { apiSlice } from 'app/api/apiSlice';

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotelReport: builder.query({
      query: (data) => {
        return {
          url: `/reports/hotel?month=${data.month}&year=${data.year}&id=${parseInt(data.id)}`
        };
      },
      transformResponse: (response) => response?.data
    }),
    getHotelsReport: builder.query({
      query: (data) => {
        return {
          url: `/reports/hotels?month=${data.month}&year=${data.year}`
        };
      },
      transformResponse: (response) => {
        return response?.data;
      }
    }),

    getReport: builder.query({
      query: ({ month, year }) => ({
        url: `/reports?month=${month}&year=${year}`
      }),
      transformResponse: (response) => {
        return response?.data;
      }
    }),
    getGeneralReport: builder.query({
      query: ({ month, year }) => ({
        url: `/reports/general?month=${month}&year=${year}`
      }),
      transformResponse: (response) => {
        return response?.data;
      }
    }),

    createBalance: builder.mutation({
      query: ({ data }) => ({
        url: `/reports/create-balance`,
        method: 'POST',
        type: 'application/json',
        body: data
      }),
      transformResponse: (response) => response?.data
    }),
    getBalances: builder.query({
      query: () => ({
        url: `/reports/balances`
      }),
      transformResponse: (response) => response?.data,
      providesTags: (result = []) => ['Balance', ...result.map(({ id }) => ({ type: 'Balance', id }))]
    }),
    deleteBalance: builder.mutation({
      query: (id) => ({
        url: `/reports/balances/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['Balance']
    })
  })
});

export const {
  useGetHotelReportQuery,
  useCreateBalanceMutation,
  useGetBalancesQuery,
  useGetReportQuery,
  useDeleteBalanceMutation,
  useGetGeneralReportQuery,
  useGetHotelsReportQuery
} = reportApiSlice;
