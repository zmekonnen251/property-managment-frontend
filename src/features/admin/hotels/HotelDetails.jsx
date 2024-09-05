import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Paper, Typography, Grid, useTheme } from '@mui/material';
import { useGetHotelQuery } from './hotelsApiSlice';
import Loading from 'components/Loading';
import { Box } from '@mui/system';
import HotelGeneralReport from './report/HotelReport';
import HotelDailyReservations from './report/HotelDailyReservations';
// import Datatable from 'components/Datatable';

const StyledTypography = ({ children }) => (
  <Typography
    sx={{
      bgcolor: 'success.main',
      color: 'white',
      p: 3,
      borderRadius: 3,
      fontSize: '1rem',
      textAlign: 'center',
      textTransform: 'uppercase',
      cursor: 'pointer',
      '&:hover': {
        bgcolor: 'primary.dark'
      },
      fontWeight: 'bold'
    }}
  >
    {children}
  </Typography>
);
const HotelDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const { data, isLoading } = useGetHotelQuery(id);

  if (isLoading) <Loading />;
  return (
    <Box>
      <HotelGeneralReport id={id} />

      <Paper
        elevation={5}
        sx={{
          padding: 2,
          [theme.breakpoints.down('sm')]: {
            padding: 1
          },
          maxWidth: '100%',
          my: 4
        }}
      >
        <Grid container spacing={3}>
          {data?.type === 'guest-house' && (
            <>
              <Grid item xs={12} lg={3} sm={12} md={6}>
                <Link to={`/dashboard/hotels/${id}/rooms`} style={{ textDecoration: 'none' }}>
                  <StyledTypography>Rooms</StyledTypography>
                </Link>
              </Grid>
              <Grid item xs={12} lg={3} sm={12} md={6}>
                <Link to={`/dashboard/hotels/${id}/room-types`} style={{ textDecoration: 'none' }}>
                  <StyledTypography>Room Types</StyledTypography>
                </Link>
              </Grid>
              <Grid item xs={12} lg={3} sm={12} md={6}>
                <Link to={`/dashboard/hotels/${id}/reservations`} style={{ textDecoration: 'none' }}>
                  <StyledTypography>Room Reservations</StyledTypography>
                </Link>
              </Grid>
            </>
          )}

          {(data?.type === 'residential' || data?.type === 'shop') && (
            <>
              <Grid item xs={12} lg={3} sm={12} md={6}>
                <Link
                  to={`/dashboard/hotels/${id}/rental-rooms`}
                  state={{ hotelType: data?.type, hotel: data }}
                  style={{ textDecoration: 'none' }}
                >
                  <StyledTypography>Lease Units</StyledTypography>
                </Link>
              </Grid>
              <Grid item xs={12} lg={3} sm={12} md={6}>
                <Link to={`/dashboard/hotels/${id}/rental-room-reservations`} style={{ textDecoration: 'none' }}>
                  <StyledTypography>Lease Records</StyledTypography>
                </Link>
              </Grid>
              <Grid item xs={12} lg={3} sm={12} md={6}>
                <Link to={`/dashboard/hotels/${id}/rental-income`} style={{ textDecoration: 'none' }}>
                  <StyledTypography>Rental Income</StyledTypography>
                </Link>
              </Grid>
            </>
          )}

          <Grid item xs={12} lg={3} sm={12} md={6}>
            <Link to={`/dashboard/hotels/${id}/expenses`} style={{ textDecoration: 'none' }}>
              <StyledTypography>Expenses</StyledTypography>
            </Link>
          </Grid>
          <Grid item xs={12} lg={3} sm={12} md={6}>
            <Link to={`/dashboard/hotels/${id}/drawings`} style={{ textDecoration: 'none' }}>
              <StyledTypography>Drawings</StyledTypography>
            </Link>
          </Grid>
          <Grid item xs={12} lg={3} sm={12} md={6}>
            <Link to={`/dashboard/hotels/${id}/report`} style={{ textDecoration: 'none' }}>
              <StyledTypography>Report</StyledTypography>
            </Link>
          </Grid>
          {data?.type === 'guest-house' && (
            <Grid item xs={12} lg={3} sm={12} md={6}>
              <Link to={`/dashboard/hotels/${id}/cleaned-rooms`} style={{ textDecoration: 'none' }}>
                <StyledTypography>Cleaned Rooms</StyledTypography>
              </Link>
            </Grid>
          )}
        </Grid>
      </Paper>
      {data?.type === 'guest-house' && <HotelDailyReservations id={id} hotelName={data.name} />}
    </Box>
  );
};

export default HotelDetails;
