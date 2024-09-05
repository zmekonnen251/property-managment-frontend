import { TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

const FormTextField = ({ name, label, control, defaultValue, type }) => (
  <Controller
    control={control}
    name={name}
    defaultValue={defaultValue ?? null}
    render={({ field: { onChange, value, ref }, fieldState }) => (
      <TextField
        type={type ?? 'text'}
        fullWidth
        labelId={`${name}-input`}
        onChange={onChange}
        value={value}
        label={label}
        ref={ref}
        error={fieldState.error}
        helperText={fieldState?.error?.message}
      />
    )}
  />
);

export default FormTextField;
