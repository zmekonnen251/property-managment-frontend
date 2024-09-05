import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, useTheme } from '@mui/material';
import { useGetLatestReservationsQuery } from '../hotels/reservations/reservationsApiSlice';
import HotelsReport from '../reports/HotelsReport';
import GeneralReport from '../reports/GeneralReport';
import { gridSpacing } from 'store/constant';
import LatestReservations from './LatestReservations';
import { Link } from 'react-router-dom';

const StyledTypography = ({ styles, children }) => (
  <Typography
    sx={{
      color: 'white',
      p: 3,
      borderRadius: 3,
      fontSize: {
        xs: '.8rem',
        sm: '1rem',
        md: '1.3rem',
        lg: '1.5rem'
      },
      textAlign: 'center',
      textTransform: 'uppercase',
      cursor: 'pointer',

      fontWeight: 'bold',
      ...styles
    }}
  >
    {children}
  </Typography>
);
const Home = () => {
  const { data, isLoading } = useGetLatestReservationsQuery();
  const { properties } = useSelector((state) => state.customization);
  const theme = useTheme();
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid
          container
          spacing={2}
          sx={{
            [theme.breakpoints.down('sm')]: {
              px: 2
            }
          }}
        >
          {properties &&
            properties.map((item, index) => {
              return (
                <Grid item key={index} xs={6} lg={3} sm={6} md={6}>
                  <Link key={index} to={`/dashboard/hotels/${item.id}`} style={{ textDecoration: 'none' }}>
                    <StyledTypography
                      styles={{
                        // set different background color for each item
                        bgcolor: item.bg,
                        '&:hover': {
                          bgcolor: item.hoverBg
                        }
                      }}
                    >
                      {item.name}
                    </StyledTypography>
                  </Link>
                </Grid>
              );
            })}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <GeneralReport />
        <HotelsReport />
        <LatestReservations isLoading={isLoading} reservations={data?.latestReservations} />
      </Grid>
    </Grid>
  );
};

export default Home;
