import { apiSlice } from 'app/api/apiSlice';

export const expensesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchHotelExpenses: builder.query({
      query: (id) => `/hotels/${id}/expenses`,
      transformResponse: (response) => response?.data,
      providesTags: (result = []) => (result ? ['Expense', ...result.map(({ id }) => ({ type: 'Expense', id }))] : ['Expense'])
    }),
    fetchExpense: builder.query({
      query: (id) => `/expenses/${id}`,
      transformResponse: (response) => response?.data,
      providesTags: (result, error, arg) => [{ type: 'Expense', id: arg.id }]
    }),
    createHotelExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: `hotels/${id}/expenses`,
        method: 'POST',
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['Expense']
    }),
    updateExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: `/expenses/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data', // 'application/json
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ['Expense']
    }),
    deleteExpense: builder.mutation({
      query: ({ id }) => ({
        url: `/expenses/${id}`,
        method: 'DELETE'
      }),

      invalidatesTags: ['Expense']
    }),
    getMonthlyExpenseStats: builder.query({
      query: () => '/expenses/monthly-stats'
    }),
    getHotelMonthlyExpenses: builder.query({
      query: ({ id, monthYear, type }) =>
        `/hotels/${id}/expenses/monthly-expense?month=${monthYear.month}&year=${monthYear.year}&type=${type}`,
      transformResponse: (response) => response?.data
    })
  })
});

export const {
  useFetchHotelExpensesQuery,
  useFetchExpenseQuery,
  useCreateHotelExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetMonthlyExpenseStatsQuery,
  useGetHotelMonthlyExpensesQuery
} = expensesApiSlice;
