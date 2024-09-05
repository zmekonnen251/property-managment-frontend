import React, { useState } from 'react';
import { useGetHotelReportQuery } from 'features/admin/reports/reportsApiSlice';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EarningCard from 'views/dashboard/Default/EarningCard';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import { gridSpacing } from 'store/constant';
import BackButton from 'components/BackButton';

const HotelGeneralReport = ({ id }) => {
  const [monthYear, setMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate()
  });
  const { data, isLoading } = useGetHotelReportQuery({ month: monthYear.month, year: monthYear.year, id: parseInt(id) });
  const theme = useTheme();

  return (
    <Paper sx={{ padding: 2, maxWidth: '100%' }}>
      <BackButton
        sx={{
          [theme.breakpoints.down('sm')]: {
            display: 'none'
          }
        }}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 3,
            py: 1.5
          }
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textTransform: 'uppercase',
            textAlign: 'left',
            letterSpacing: 1,
            fontFamily: 'monospace',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.3rem',
              lineHeight: 1.5,
              letterSpacing: 0.5
            }
          }}
        >
          {data?.name}{' '}
          <strong style={{ textDecoration: 'underline' }}>
            {dayjs(`${data?.year}-${data?.month}-${monthYear?.day}`).format('MMMM-YYYY')}
          </strong>{' '}
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
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
            sx={{ [theme.breakpoints.down('sm')]: { width: '100%' } }}
          />
        </LocalizationProvider>
      </Box>
      <Grid container spacing={gridSpacing}>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <TotalIncomeDarkCard
              isLoading={isLoading}
              value={` ${data?.revenue}`}
              isMoney={true}
              icon="StorefrontTwoTone"
              title={data?.type === 'guest-house' ? 'Reservations Revenue' : 'Lease Units Revenue'}
            />
          </Grid>
        </Grid>

        <Grid item lg={6} md={6} sm={12} xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={6} md={6} sm={12}>
              <TotalIncomeDarkCard
                isLoading={isLoading}
                value={` ${data?.expenses.totalExpenses ?? 0}`}
                isMoney={true}
                icon="StorefrontTwoTone"
                title="Total Expense"
              />
            </Grid>
            <Grid item xs={12} lg={6} md={6} sm={12}>
              <TotalIncomeDarkCard
                isLoading={isLoading}
                value={` ${data?.expenses.totalExpensesByType.drawings ?? 0}`}
                isMoney={true}
                icon="StorefrontTwoTone"
                title="Drawings"
              />
            </Grid>
            <Grid item xs={12} lg={6} md={6} sm={12}>
              <TotalIncomeDarkCard
                isLoading={isLoading}
                value={` ${data?.expenses.totalExpensesByType.default ?? 0}`}
                isMoney={true}
                icon="StorefrontTwoTone"
                title="Total Default Expenses"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={3} md={4} sm={12} xs={12}>
          <EarningCard isLoading={isLoading} isMoney={true} value={` (${data?.netRevenue ?? 0})`} title="Net Revenue" />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HotelGeneralReport;
