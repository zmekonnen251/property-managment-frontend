import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useFetchRoomTypeQuery } from './roomsApiSlice';

import Loading from 'components/Loading';
import RoomTableRow from './RoomTableRow';
import useAuth from 'hooks/useAuth';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const RoomTypeDetails = () => {
  const user = useAuth();
  const { id, roomTypeId } = useParams();
  const { data, isSuccess, isFetching } = useFetchRoomTypeQuery(roomTypeId);

  let availableRooms = 0;
  const rooms = data?.rooms;

  if (isSuccess) {
    rooms?.forEach((a) => {
      if (a.status === 'available') {
        availableRooms += 1;
      }
    });
  }
  const readyRooms = rooms?.filter((room) => room.ready === true)?.length;

  if (isFetching) {
    return <Loading />;
  }

  return (
    <PageWrapper title={`Room Type ${data.name} Details`}>
      {isSuccess && (
        <Box sx={{ my: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 3, mb: 3 }}>
            <Link
              to={`/dashboard/hotels/${id}/room-types/${roomTypeId}/edit`}
              state={{
                ...data
              }}
            >
              <Button variant="outlined" size="large">
                Edit
              </Button>
            </Link>
            <Link to={`/dashboard/hotels/${id}/rooms/new`} state={{ RoomTypeId: roomTypeId, RoomTypeName: data?.name }}>
              <Button variant="contained" size="large">
                Add Room
              </Button>
            </Link>
          </Box>

          <Box
            direction="column"
            spacing={2}
            sx={{
              p: 0.5,
              display: 'flex',
              flexDirection: 'column',
              width: '80%'
            }}
          >
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

          {rooms?.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2, width: '80%' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Room No</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Smoking</TableCell>
                    <TableCell align="left">Room Type</TableCell>
                    <TableCell align="left">Ready</TableCell>
                    {user?.isAdmin && <TableCell align="left">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms?.map((room) => (
                    <RoomTableRow key={room.id} room={room} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ textAlign: 'center' }}>There is no room for {data?.name} type</Typography>
          )}
        </Box>
      )}
    </PageWrapper>
  );
};

export default RoomTypeDetails;
