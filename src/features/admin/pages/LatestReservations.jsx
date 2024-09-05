import React from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from '@mui/material';

import TableSkeleton from 'ui-component/cards/Skeleton/Table';

const LatestReservations = ({ reservations, isLoading }) => {
  const theme = useTheme();
  return (
    <>
      {isLoading && <TableSkeleton />}
      {!isLoading && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            flexGrow: 1,
            // margin: 'auto',
            mt: 3,
            width: '100%',
            maxWidth: 1150,
            minWidth: '80vw',
            [theme.breakpoints.down('sm')]: {
              display: 'none'
            }
          }}
        >
          <Table sx={{ minWidth: 350 }}>
            <TableHead>
              <TableRow>
                <TableCell>Reservation ID</TableCell>
                <TableCell>Rooms Number</TableCell>
                <TableCell>Guest</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations &&
                reservations?.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.id}</TableCell>
                    <TableCell>{reservation.roomNumbers.join(',')}</TableCell>
                    <TableCell>{reservation?.Guest?.id}</TableCell>
                    <TableCell>
                      {new Date(reservation.dateIn).toDateString()}
                      {' - '}
                      {new Date(reservation.dateIn).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {new Date(reservation.dateOut).toDateString()}
                      {' - '}
                      {new Date(reservation.dateOut).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{reservation.paidAmount}</TableCell>
                    <TableCell>{reservation.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
};

export default LatestReservations;
