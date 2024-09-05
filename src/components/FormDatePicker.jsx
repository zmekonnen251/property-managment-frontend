import { FormControl, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';
import { Controller } from 'react-hook-form';

const FormDatePicker = ({ name, label, control, defaultValue }) => (
  <Controller
    control={control}
    name={name}
    defaultValue={defaultValue ?? null}
    render={({ field: { onChange, value, ref }, fieldState }) => (
      <>
        <FormControl fullWidth>
          {/* <InputLabel id={`${name}-select`}>{label}</InputLabel> */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={onChange}
              view={['year', 'month', 'day']}
              value={value}
              label={label}
              labelId={`${name}-select`}
              id={`${name}-select`}
              ref={ref}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField sx={{ width: '100%' }} {...params} error={fieldState.error} />}
            />
          </LocalizationProvider>
        </FormControl>
      </>
    )}
  />
);

export default FormDatePicker;
