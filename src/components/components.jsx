import { Grid } from '@mui/material';
import React from 'react';

export const ImageList = ({ children }) => (
  <Grid container spacing={3}>
    {children}
  </Grid>
);

export const Image = ({ src, ...props }, ref) => (
  <img ref={ref} src={src} className="mr-2 mb-2 w-24 h-24 cursor-pointer object-cover" alt="" {...props} />
);

export const Button = ({ primary, className = '', ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={`px-4 py-2 mr-2 rounded-md focus:outline-none cursor-pointer select-none ${
      primary ? 'bg-sky-600 text-white hover:bg-sky-700' : 'border border-gray-300 hover:text-white hover:bg-sky-500 hover:border-sky-500'
    } ${className}`}
  />
);

export const Overlay = ({ children }) => (
  <div className="absolute left-0 bottom-0 p-2 w-full min-h-24 text-sm text-slate-300 z-50 bg-black/50">{children}</div>
);
