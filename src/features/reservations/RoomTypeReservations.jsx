import React from 'react';
import { Container, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import Loading from 'components/Loading';

import { useFetchRoomTypeReservationsQuery } from '../admin/hotels/rooms/roomsApiSlice';
import MaterialTable from 'components/MaterialTable';
import { currency } from 'store/constant';

const columns = [
  {
    Header: 'Id',
    accessorKey: 'id'
  },
  {
    Header: 'Guest Name',
    accessorKey: 'Guest.name'
  },
  {
    Header: 'Guest Phone',
    accessorKey: 'Guest.phone'
  },
  {
    Header: 'Rooms',
    accessorKey: 'rooms'
  },
  {
    Header: 'Paid Amount',
    accessorKey: 'paidAmount'
  },
  {
    Header: 'Paid By',
    accessorKey: 'paidBy'
  },
  {
    Header: 'Status',
    accessorKey: 'status'
  },
  {
    Header: 'Date Out',
    accessorKey: 'dateOut'
  }
];

const RoomTypeReservations = () => {
  const params = useParams();
  const { id, roomTypeId } = params;

  const { data, isFetching } = useFetchRoomTypeReservationsQuery(roomTypeId);
  const rows = data?.data?.roomTypeReservations.map((reservation) => ({
    ...reservation,
    rooms: reservation.roomNumbers.join(', '),
    Guest: {
      name: reservation.Guest.firstName + ' ' + reservation.Guest.lastName,
      phone: reservation.Guest.phone
    },
    paidAmount: `${currency} ${reservation.paidAmount}`
  }));
  return (
    <Container maxWidth="lg" sx={{ mx: 'auto', pt: 10 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        {isFetching ? (
          <Loading />
        ) : (
          <MaterialTable
            name="Room Type Reservations"
            rows={rows}
            mobileViewColumns={['Guest.name', 'rooms', 'status']}
            columns={columns}
            addNewLink={`/hotels/${id}/room-types/${roomTypeId}/reservations/new`}
            back={true}
          />
        )}
      </Paper>
    </Container>
  );
};

export default RoomTypeReservations;
