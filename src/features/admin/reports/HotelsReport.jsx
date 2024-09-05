import React, { useState } from 'react';
import { useGetHotelsReportQuery } from './reportsApiSlice';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import HotelCard from './HotelCard';
import { gridSpacing } from 'store/constant';
import { useTheme } from '@mui/material';

const Report = () => {
  const theme = useTheme();
  const [monthYear, setMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate()
  });

  const { data, isLoading } = useGetHotelsReportQuery(monthYear);
  return (
    <Paper
      sx={{
        padding: 3,
        my: 5,
        [theme.breakpoints.down('sm')]: {
          my: 2.5
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 3
          },
          py: 2
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: 'left'
          }}
        >
          Properties Report Summary
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            openTo="month"
            fullWidth
            label="Select A Month and Year"
            value={dayjs(`${monthYear.year}-${monthYear.month}-${monthYear.day}`)}
            onChange={(date) => {
              setMonthYear({
                month: dayjs(date).month() + 1,
                year: dayjs(date).year(),
                day: dayjs(date).date()
              });
            }}
            views={['month', 'year']}
            slotProps={{ textField: { variant: 'outlined' } }}
            sx={{
              [theme.breakpoints.down('sm')]: {
                width: '100%'
              }
            }}
          />
        </LocalizationProvider>
      </Box>
      <Grid
        container
        spacing={gridSpacing}
        sx={{
          [theme.breakpoints.down('sm')]: {
            pb: 3
          }
        }}
      >
        {data?.map((hotel, index) => (
          <Grid key={index} item xs={12} md={6} lg={4}>
            <HotelCard key={index} hotel={hotel} isLoading={isLoading} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default Report;
