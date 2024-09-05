import React from 'react';
import { Controller } from 'react-hook-form';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const FormSelect = ({ name, label, control, defaultValue, options }) => (
  <Controller
    control={control}
    name={name}
    defaultValue={defaultValue ?? null}
    render={({ field: { onChange, value, ref }, fieldState }) => (
      <>
        <FormControl fullWidth>
          <InputLabel id={`${name}-select`}>{label}</InputLabel>
          <Select
            fullWidth
            labelId={`${name}-select`}
            onChange={onChange}
            value={value}
            label={label}
            ref={ref}
            error={fieldState.error}
            helperText={fieldState?.error?.message}
            placeholder={`Select ${label}`}
          >
            <MenuItem value="">
              Select
              {label}
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    )}
  />
);

export default FormSelect;
