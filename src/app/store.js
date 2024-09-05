import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import customizationReducer from 'store/customizationSlice';
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    customization: customizationReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
});
