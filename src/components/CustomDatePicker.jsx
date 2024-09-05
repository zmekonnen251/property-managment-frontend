import { TextField, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React from 'react';

const CustomDatePicker = ({ title, onDateSelected, value, views = ['year', 'month', 'day'], openTo = 'day' }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: 3,
          py: 2,
          px: 1
        },
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 2
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 'bold',
          textAlign: 'left',
          letterSpacing: '1px',
          [theme.breakpoints.down('sm')]: {
            letterSpacing: '0.5px',
            fontSize: '16px'
          }
        }}
      >
        {title}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ [theme.breakpoints.down('sm')]: { width: '100%' } }}
          openTo={openTo}
          label="Select A Month and Year"
          value={dayjs(`${value.year}-${value.month}-${value.day}`)}
          onChange={(newValue) => {
            onDateSelected({
              year: dayjs(newValue).year(),
              month: dayjs(newValue).month() + 1,
              day: dayjs(newValue).date()
            });
          }}
          views={views}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default CustomDatePicker;
