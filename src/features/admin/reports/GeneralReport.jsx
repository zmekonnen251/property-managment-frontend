import React, { useState } from 'react';
import { useGetReportQuery } from '../reports/reportsApiSlice';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EarningCard from 'views/dashboard/Default/EarningCard';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import TotalIncomeLightCard from 'views/dashboard/Default/TotalIncomeLightCard';
// import { gridSpacing } from 'store/constant';
import { useTheme } from '@mui/material';

const GeneralReport = () => {
  const theme = useTheme();
  const [monthYear, setMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate()
  });
  const { data, isLoading } = useGetReportQuery(monthYear);

  const { totalRevenue, totalDefaultExpenses, totalSalaries, totalReservationsRevenue, totalRentalRevenue, totalDrawings, netRevenue } =
    data || {};
  return (
    <Paper sx={{ padding: 2, maxWidth: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          my: 1.5,

          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            gap: 3
          }
        }}
      >
        <Typography variant="h2" sx={{ textAlign: 'left' }}>
          Combined {dayjs.tz(`${monthYear.year}-${monthYear.month}`).format('MMMM-YYYY')} Report
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            timezone="Africa/Johannesburg"
            sx={{
              [theme.breakpoints.down('sm')]: {
                width: '100%',
                mb: 3
              }
            }}
            openTo="month"
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
          />
        </LocalizationProvider>
      </Box>
      <Grid container spacing={3}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Grid item xs={12} sx={{ mb: 2 }}>
            <TotalIncomeDarkCard
              isLoading={isLoading}
              value={totalRentalRevenue}
              isMoney={true}
              icon="StorefrontTwoTone"
              title="Combined Lease Units Revenue"
            />
          </Grid>
          <Grid item xs={12}>
            <TotalIncomeLightCard
              isLoading={isLoading}
              value={totalReservationsRevenue}
              isMoney={true}
              icon="Money"
              title="Combined Reservations Revenue"
            />
          </Grid>
        </Grid>
        <Grid item lg={3} md={3} sm={6} xs={12}>
          <EarningCard isLoading={isLoading} isMoney={true} value={totalRevenue} title="Combined Total Revenue" />
        </Grid>

        <Grid item lg={3} md={6} sm={12} xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TotalIncomeDarkCard
                isLoading={isLoading}
                value={totalDefaultExpenses}
                isMoney={true}
                icon="StorefrontTwoTone"
                title="Combined Properties Expense"
              />
            </Grid>
            <Grid item xs={12}>
              <TotalIncomeDarkCard
                isLoading={isLoading}
                value={totalDrawings}
                isMoney={true}
                icon="StorefrontTwoTone"
                title="Combined Properties Drawings"
              />
            </Grid>
            <Grid item xs={12}>
              <TotalIncomeLightCard isLoading={isLoading} value={totalSalaries} isMoney={true} icon="Money" title="Combined Salaries" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={3} md={4} sm={12} xs={12}>
          <EarningCard isLoading={isLoading} isMoney={true} value={netRevenue} title="Net Revenue" />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GeneralReport;
