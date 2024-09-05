import React from 'react';
import { Typography, Grid, Paper, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetHotelsQuery } from '../admin/hotels/hotelsApiSlice';
import Loading from '../../components/Loading';
import { Container } from '@mui/system';

const Hotels = () => {
  const { data, isFetching } = useGetHotelsQuery();
  const theme = useTheme();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const filteredHotels = data?.filter((hotel) => hotel?.type === 'guest-house');

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          fontSize: {
            xs: '1.5rem',
            sm: '2rem',
            md: '2.5rem',
            lg: '3rem'
          },
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          textAlign: 'center',
          mb: '30px',
          letterSpacing: 3,
          textTransform: 'uppercase'
        }}
      >
        Properties
      </Typography>
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center' }}>
        {isFetching && <Loading />}
        {!isFetching && (
          <>
            <Grid container spacing={6}>
              {filteredHotels?.map((hotel) => (
                <Grid item xs={12} sm={12} md={6} lg={6} key={hotel?.id}>
                  <Link to={`/hotels/${hotel?.id}`} style={{ textDecoration: 'none' }}>
                    <Paper
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: 200,
                        [theme.breakpoints.down('sm')]: {
                          height: 120
                        },
                        width: '100%',
                        borderRadius: 5,
                        boxShadow: 1,
                        backgroundImage: 'linear-gradient(rgba(51,9,100,0.5),rgba(89,90,4,.5))',
                        // color: 'white',
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: 3,
                          bgcolor: 'background.default'
                        }
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: {
                            xs: '1.5rem',
                            sm: '2rem',
                            md: '2.5rem',
                            lg: '3rem'
                          },
                          fontWeight: 'bold',
                          textShadow: '2px 2px 2px rgba(0,0,0,0.5)',

                          color: 'whitesmoke'
                        }}
                      >
                        {hotel?.name}
                      </Typography>
                    </Paper>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default Hotels;
