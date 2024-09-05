import React from 'react';
import { Typography, Grid, Box, Container, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetHotelRoomTypesQuery } from '../admin/hotels/hotelsApiSlice';
import Loading from 'components/Loading';
import Card from 'components/Card';
import BackButton from 'components/BackButton';

const RoomTypes = () => {
  const { id } = useParams();
  const { data, isFetching } = useGetHotelRoomTypesQuery(id);
  const theme = useTheme();
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ my: 2 }}>
        <BackButton />
      </Box>
      {isFetching ? (
        <Loading />
      ) : (
        <Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontWeight: 'bold',
              color: '#4a4a4a',
              pb: 1,
              [theme.breakpoints.down('md')]: {
                fontSize: '1.5rem',
                mb: 0,
                mt: 2
              }
            }}
          >
            Room Types of {data[0]?.Hotel.name}
          </Typography>

          <Grid container spacing={2}>
            {isFetching ? (
              <Loading />
            ) : (
              data?.map((roomType) => (
                <Grid item xs={12} sm={12} md={4} lg={4} key={roomType.id}>
                  <Card
                    imageUrl={roomType.cover}
                    caption={roomType.name}
                    actionLink={`/hotels/${roomType.Hotel.id}/room-types/${roomType.id}`}
                    text={roomType.description}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default RoomTypes;
