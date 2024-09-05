import { apiSlice } from 'app/api/apiSlice';

export const employeesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => '/employees',
      transformResponse: (response) => {
        const employees = response?.data?.map((employee) => {
          if (!employee.hotels)
            return {
              ...employee,
              hotelNames: ''
            };

          const hotelNames = employee.hotels
            ?.map((hotelId) => {
              return response.hotels.find((hotel) => hotel.id === hotelId)?.name;
            })
            ?.join(', ');

          return {
            ...employee,
            hotelNames
          };
        });
        return employees;
      },
      providesTags: (result = []) => ['Employee', ...result.map(({ id }) => ({ type: 'Employee', id }))]
    }),
    getEmployee: builder.query({
      query: (id) => `/employees/${id}`,

      transformResponse: (response) => response?.data,

      providesTags: (_result, _error, arg) => [{ type: 'Employee', id: arg.id }]
    }),
    updateEmployee: builder.mutation({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'PATCH',
        type: 'multipart/form-data',
        body: data
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: (_result, _error, arg) => [{ type: 'Employee', id: arg.id }]
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Employee', id: arg.id }]
    }),
    activateEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/activate/${id}`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Employee']
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: '/employees',
        method: 'POST',
        body: data
      }),
      transformResponse: (response) => response?.data,

      invalidatesTags: ['Employee']
    })

  })
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
  useActivateEmployeeMutation
} = employeesApiSlice;
