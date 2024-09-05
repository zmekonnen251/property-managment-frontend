import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetHotelsQuery, useGetHotelQuery } from '../admin/hotels/hotelsApiSlice';
import BackButton from 'components/BackButton';
import useAuth from 'hooks/useAuth';
import { toast } from 'react-toastify';

const Hotel = () => {
  const user = useAuth();
  const navigate = useNavigate();
  if (!user.isLoggedIn) {
    toast.error('You are not login or authorized to access this page!', {
      position: 'top-center',
      toastId: 'protected-route-employee'
    });
    navigate('/auth/login')
  }

  const theme = useTheme();
  const { id } = useParams();
  const { data: hotel } = useGetHotelQuery(id);
  const { data: hotelsData } = useGetHotelsQuery();
  const filteredHotel = hotelsData?.filter((hotel) => user.hotels.includes(hotel.id) && hotel.type === 'shop');

  //a function to show live time
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());
  const [date, setDate] = React.useState(new Date().toLocaleDateString());

  //Reduce rerendering of the component by using useEffect and useMemo

  const memoizedValue = React.useMemo(() => {
    return new Date().toLocaleTimeString();
  }, []);

  // use the memoized value
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(memoizedValue);
    }, 1000);
    return () => clearInterval(interval);
  }, [memoizedValue]);

  const memoizedDate = React.useMemo(() => {
    return new Date().toLocaleDateString();
  }, []);

  // use the memoized value
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(memoizedDate);
    }, 1000);
    return () => clearInterval(interval);
  }, [memoizedDate]);

  return (
    <Paper
      sx={{
        p: 6,
        mx: 'auto',
        maxWidth: '70%',
        [theme.breakpoints.down('sm')]: {
          maxWidth: '100%',
          p: 1,
          mx: 2,
          mt: 14,
          px: 2,
          pb: 3
        }
      }}
    >
      <Box sx={{ my: 2 }}>
        <BackButton />
      </Box>
      <Box
        sx={{
          gap: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: 15,
              sm: 15,
              md: 20,
              lg: 25
            }
          }}
        >
          {hotel?.name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: {
              xs: 15,
              sm: 18,
              md: 23,
              lg: 23
            }
          }}
        >
          Wellcome Back!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: {
              xs: 15,
              sm: 18,
              md: 23,
              lg: 23
            }
          }}
        >
          Today is {date} and the time is {time}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            // alignItems: 'center',
            // justifyContent: 'center',
            flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'row',
              lg: 'row'
            }
          }}
        >
          <Link to={`/hotels/${id}/room-types`}>
            <Button
              size="large"
              variant="contained"
              sx={{
                fontSize: 20,
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '100%',
                  lg: '100%'
                }
              }}
            >
              Room Types
            </Button>
          </Link>

          <Link to={`/hotels/${id}/reservations`}>
            <Button
              size="large"
              variant="contained"
              sx={{
                fontSize: 20,
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '100%',
                  lg: '100%'
                }
              }}
            >
              Reservations
            </Button>
          </Link>

          <Link to={`/hotels/${id}/reservations/new`}>
            <Button
              size="large"
              variant="contained"
              sx={{
                fontSize: 20,
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '100%',
                  lg: '100%'
                }
              }}
            >
              New Reservation
            </Button>
          </Link>

          {(filteredHotel?.length > 0 || user.isAdmin) && (
            <Link to={`/rental-reservations`}>
              <Button
                size="large"
                variant="contained"
                sx={{
                  fontSize: 20,
                  width: {
                    xs: '100%',
                    sm: '100%',
                    md: '100%',
                    lg: '100%'
                  }
                }}
              >
                Renew Leased Shops
              </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default Hotel;
