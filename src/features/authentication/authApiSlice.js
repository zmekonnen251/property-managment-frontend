import Cookies from 'js-cookie';
import { apiSlice } from 'app/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/employees/login',
        method: 'POST',
        body: { ...credentials }
      })
    }),

    registerEmployee: builder.mutation({
      query: (credentials) => ({
        url: '/employees/register',
        method: 'POST',
        body: { ...credentials }
      })
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/employees/forgot-password',
        method: 'POST',
        body: { email }
      })
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: `/employees/reset-password/${credentials.token}`,
        method: 'PATCH',
        body: { password: credentials.password }
      })
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: '/employees/update-my-password',
        method: 'PATCH',
        body: { ...credentials }
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/employees/logout',
        method: 'DELETE'
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          Cookies.remove('token');

          // setTimeout(() => {
          //   dispatch(apiSlice.util.resetApiState());
          // }, 1000);
        } catch (err) {
          // console.log(err);
        }
      }
    })
  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterEmployeeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation
} = authApiSlice;
