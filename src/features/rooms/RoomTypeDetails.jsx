import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import RoomTableRow from '../admin/hotels/rooms/RoomTableRow';
import { useFetchRoomTypeQuery } from '../admin/hotels/rooms/roomsApiSlice';
import { useGetHotelRoomsQuery } from '../admin/hotels/hotelsApiSlice';
import Loading from 'components/Loading';
import useAuth from 'hooks/useAuth';
import BackButton from 'components/BackButton';

const RoomTypeDetails = () => {
  const user = useAuth();
  const { roomTypeId, id } = useParams();
  const { data, isSuccess, isFetching } = useFetchRoomTypeQuery(roomTypeId);
  const { data: allRooms, isSuccess: isRoomsSuccess } = useGetHotelRoomsQuery(id, {
    pollingInterval: 240000
  });

  // if (isFetching) {
  // 	return <Loading />;
  // }
  let availableRooms = 0;
  const rooms = allRooms?.filter((room) => room.RoomTypeId === parseInt(roomTypeId));
  if (isSuccess) {
    rooms?.forEach((a) => {
      if (a.status === 'available') {
        availableRooms += 1;
      }
    });
  }
  const readyRooms = rooms?.filter((room) => room.ready === true).length;

  if (isFetching) {
    return <Loading />;
  }

  return (
    <Paper sx={{ maxWidth: '80%', p: 4, mx: 'auto' }}>
      {isSuccess && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
            <BackButton />
            {(user?.role === 'admin' ||
              (id === '1' && user?.role === 'receptionist1') ||
              (id === '2' && user?.role === 'receptionist2')) && (
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Link to={`/hotels/${id}/room-types/${roomTypeId}/reservations`}>
                  <Button variant="contained" size="medium">
                    {data?.name} Reservations
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box
              component={Paper}
              elevation={2}
              direction="column"
              spacing={2}
              sx={{
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                width: '70%',
                pl: 6
              }}
            >
              <Typography variant="h6" sx={{ fontSize: '28px' }}>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Name:{' '}
                </Typography>
                {data?.name}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Default Price:{' '}
                </Typography>
                {data?.defaultPrice}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Current Price Price:{' '}
                </Typography>
                {data?.currentPrice}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Capacity:{' '}
                </Typography>
                {data?.capacity}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Number of rooms:{' '}
                </Typography>
                {rooms?.length}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Available Rooms:{' '}
                </Typography>
                {availableRooms}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Number of Ready rooms:{' '}
                </Typography>
                {readyRooms}
              </Typography>
            </Box>
          </Box>

          {isRoomsSuccess && rooms?.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2, width: '80%' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Room No</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Smoking</TableCell>
                    <TableCell align="left">Room Type</TableCell>
                    <TableCell align="left">Ready</TableCell>

                    {user?.isFetching && <TableCell align="left">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((room) => (
                    <RoomTableRow key={room.id} room={room} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ textAlign: 'center' }}>There is no room for {data.name} type</Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default RoomTypeDetails;
