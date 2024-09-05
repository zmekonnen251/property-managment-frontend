import React from 'react';
import MaterialTable from 'components/MaterialTable';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Loading from 'components/Loading';
import useAuth from 'hooks/useAuth';
import { useDeleteReservationMutation, useFetchHotelReservationsQuery, useCheckOutReservationMutation } from './reservationsApiSlice';
import { toast } from 'react-toastify';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import { currency } from 'store/constant';

const columns = [
  {
    accessorKey: 'id',
    Header: 'ID'
  },
  {
    accessorKey: 'roomNumbers',
    Header: 'Room Number'
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
    Header: `(${currency}) Paid Amount `
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
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isFetching } = useFetchHotelReservationsQuery(id);
  const [deleteReservation] = useDeleteReservationMutation();
  const [checkOutReservation, { isSuccess }] = useCheckOutReservationMutation();
  const user = useAuth();

  const handleView = (reservationId) => {
    navigate(`/dashboard/hotels/${id}/reservations/${reservationId}`);
  };

  const handleUpdate = (reservationId) => {
    navigate(`/dashboard/hotels/${id}/reservations/${reservationId}/edit`);
  };

  const handleDelete = async (reservationId) => {
    await deleteReservation(reservationId);
  };

  const handleCheckOut = async (reservationId) => {
    await checkOutReservation(reservationId);
  };

  if (isSuccess) {
    toast.success('Reservation checked out successfully', {
      position: toast.POSITION.TOP_RIGHT,
      toastId: 'reservation-checkout'
    });
  }

  const rows = data?.map((row) => {
    return {
      ...row,
      paidAmount: row.paidAmount,
      dateIn: dayjs.tz(dayjs(row.dateIn)).format('DD-MM-YYYY HH:mm'),
      dateOut: dayjs.tz(dayjs(row.dateOut)).format('DD-MM-YYYY HH:mm'),
      roomNumbers: row.roomNumbers.join(', ') || '',
      guest: row.Guest?.firstName + ' ' + row.Guest?.lastName
    };
  }).sort((a, b) => {
    return new Date(b.dateIn) - new Date(a.dateIn);
  });

  return (
    <PageWrapper title="Reservations">
      {isFetching ? (
        <Loading />
      ) : (
        <>
          <MaterialTable
            columns={columns}
            rows={rows}
            name="reservations"
            onView={handleView}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onAddNew={() => navigate(`/hotels/${id}/reservations/new`)}
            onCheckOut={handleCheckOut}
            actions={['admin', 'manager'].includes(user.role)}
            mobileViewColumns={['date', 'roomNumbers', 'paidAmount']}
          />
        </>
      )}
    </PageWrapper>
  );
};

export default Reservations;
