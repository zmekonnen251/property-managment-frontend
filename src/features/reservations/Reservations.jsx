import React from 'react';
import { Box, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Loading from 'components/Loading';

import { useGetHotelQuery } from '../admin/hotels/hotelsApiSlice';
import { toast } from 'react-toastify';
import MaterialTable from 'components/MaterialTable';
import { useCheckOutReservationMutation } from 'features/admin/hotels/reservations/reservationsApiSlice';
import { currency } from 'store/constant';

const columns = [
  {
    accessorKey: 'id',
    Header: 'ID'
  },
  {
    accessorKey: 'roomNumbers',
    Header: 'Room Number',
    Cell: ({ cell }) => {
      return <div>{cell.getValue()?.join(', ')}</div>;
    }
  },
  {
    accessorKey: 'status',
    Header: 'Status'
  },
  {
    accessorKey: 'reservationDays',
    Header: 'Days'
  },
  {
    accessorKey: 'dateIn',
    Header: 'Date In'
  },
  {
    accessorKey: 'dateOut',
    Header: 'Date Out'
  },
  {
    accessorKey: 'paidAmount',
    Header: `(${currency}) Paid Amount`
  },
  {
    accessorKey: 'paidBy',
    Header: 'Paid By'
  },
  {
    Header: 'Guest',
    accessorKey: 'guest'
  }
];
const Reservations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetHotelQuery(id);
  const [checkOutReservation, { isSuccess: isCheckoutSuccess }] = useCheckOutReservationMutation();
  const handleUpdate = (reservationId) => {
    navigate(`/hotels/${id}/reservations/${reservationId}/edit`);
  };

  const handleView = (reservationId) => {
    navigate(`/hotels/${id}/reservations/${reservationId}`);
  };
  const handleCheckOut = async (id) => {
    await checkOutReservation(id);
  };

  if (isCheckoutSuccess)
    toast.success('Reservation checked out successfully', {
      position: toast.POSITION.TOP_RIGHT,
      toastId: 'reservation-checkout'
    });

  const rows = data?.Reservations.map((reservation) => ({
    ...reservation,
    roomNumbers: reservation.roomNumbers,
    status: reservation?.status,
    reservationDays: reservation?.reservationDays,
    paidAmount: reservation?.paidAmount,
    paidBy: reservation?.paidBy,
    guest: `${reservation?.Guest?.firstName} ${reservation?.Guest?.lastName}`,
    dateOut: dayjs.tz(dayjs(reservation.dateOut)).format('DD-MM-YYYY HH:mm'),
    dateIn: dayjs.tz(dayjs(reservation.dateIn)).format('DD-MM-YYYY HH:mm')
  })).sort((a, b) => {
    return new Date(b.dateIn) - new Date(a.dateIn);
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <MaterialTable
              name={'reservations'}
              columns={columns}
              rows={rows}
              onView={handleView}
              onUpdate={handleUpdate}
              onCheckOut={handleCheckOut}
              back={true}
              actions={true}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Reservations;
