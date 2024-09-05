import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import dayjs from 'dayjs';
import { useFetchReservationQuery } from './reservationsApiSlice';

import Loading from 'components/Loading';

import RoomTableRow from '../rooms/RoomTableRow';
import LinkButton from 'components/LinkButton';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const ReservationDetails = () => {
  const { id, reservationId } = useParams();
  const { data, isSuccess, isFetching } = useFetchReservationQuery(reservationId);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <PageWrapper title="Reservation Details">
      {isSuccess && (
        <Box sx={{ my: 2 }}>
          {/* a outlined button to edit reservation */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
            <LinkButton to={`/dashboard/hotels/${id}/reservations/${reservationId}/edit`} variant="outlined" sx={{ ml: 2 }} title="Edit" />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              direction="column"
              spacing={2}
              sx={{
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                width: '50%'
              }}
            >
              <Typography variant="h2" sx={{ fontSize: '1.6rem' }}>
                Reservation Details
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Status:{' '}
                </Typography>
                {data.status}
              </Typography>

              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Date In:{' '}
                </Typography>
                {dayjs.tz(dayjs(data.dateIn)).format('DD-MM-YYYY:HH:mm')}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Date Out:{' '}
                </Typography>
                {dayjs.tz(dayjs(data.dateOut)).format('DD-MM-YYYY:HH:mm')}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Paid Amount:{' '}
                </Typography>
                {data?.paidAmount}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Paid By:{' '}
                </Typography>
                {data?.paidBy ? data?.data?.paidBy : 'Pending'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h2" sx={{ fontSize: '1.6rem' }}>
                Guest Details
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  First Name:{' '}
                </Typography>
                {data?.Guest?.firstName}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Last Name:{' '}
                </Typography>
                {data?.Guest?.lastName}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Phone:{' '}
                </Typography>
                {data?.Guest?.phone}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Email:{' '}
                </Typography>
                {data?.Guest?.email}
              </Typography>
            </Box>
            <Box
              spacing={2}
              sx={{
                mt: 1,
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                width: '50%'
              }}
            >
              <Typography variant="h2" sx={{ fontSize: '1.6rem' }}>
                CreatedBy (Staff Details)
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  First Name:{' '}
                </Typography>
                {data?.Employee?.firstName}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Last Name:{' '}
                </Typography>
                {data?.Employee?.lastName}
              </Typography>
              <Typography>
                <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
                  Phone:{' '}
                </Typography>
                {data?.Employee?.phone}
              </Typography>
            </Box>
          </Box>

          {data?.Rooms.length > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2, width: '80%' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Room No</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Smoking</TableCell>
                    <TableCell align="left">Room Type</TableCell>
                    <TableCell align="left">Ready</TableCell>
                    <TableCell align="left">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.Rooms.map((room) => (
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
    </PageWrapper>
  );
};

export default ReservationDetails;
