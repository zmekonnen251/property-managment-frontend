// project imports
import { createSlice } from '@reduxjs/toolkit';
// action - state management
import config from 'config';

export const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'dashboard',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
  darkMode: localStorage.getItem('themeMode') || 'dark',
  properties: JSON.parse(localStorage.getItem('properties'))?.properties
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    menuOpen: (state, action) => {
      if (state.isOpen.findIndex((id) => id === action.payload) > -1) {
        return {
          ...state,
          isOpen: state.isOpen.filter((id) => id !== action.payload)
        };
      }
      return {
        ...state,
        isOpen: [...state.isOpen, action.payload]
      };
    },
    setMenu: (state) => ({
      ...state,
      opened: !state.opened
    }),
    setFont: (state, action) => ({
      ...state,
      fontFamily: action.payload
    }),
    setBorderR: (state, action) => ({
      ...state,
      borderRadius: action.payload
    }),
    toggleTheme: (state) => {
      const themeMode = state.darkMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', themeMode);

      return {
        ...state,
        darkMode: themeMode
      };
    },
    setProperties: (state, action) => ({
      ...state,
      properties: action.payload
    })
  }
});

// actions
export const { menuOpen, setMenu, setFont, setBorderR, toggleTheme, setProperties } = customizationSlice.actions;

// reducer
export default customizationSlice.reducer;
