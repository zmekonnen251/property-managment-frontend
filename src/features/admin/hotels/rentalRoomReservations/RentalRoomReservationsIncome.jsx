import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Loading from 'components/Loading';
import { useGetHotelRentalRoomReservationsQuery } from './rentalRoomReservationsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import MaterialTable from 'components/MaterialTable';
import { currency } from 'store/constant';

const columns = [
  {
    Header: 'Unit Number',
    accessorKey: 'roomNumber'
  },
  {
    Header: `Unpaid Amount (${currency})`,
    accessorKey: 'unpaidAmount'
  },
  {
    Header: 'Active Period',
    accessorKey: 'activePeriod'
  },
  {
    Header: `Last Paid (${currency})`,
    accessorKey: 'lastPaid'
  },
  {
    Header: 'Last Paid Date',
    accessorKey: 'lastPaidDate'
  },
  {
    Header: 'Active Until',
    accessorKey: 'dateOut'
  }
];

const RentalRoomReservations = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isFetching } = useGetHotelRentalRoomReservationsQuery(id);

  const rows = data?.map((item) => ({
    roomNumber: item.RentalRoom.roomNumber,
    unpaidAmount: item.unpaidAmount,
    activePeriod: `${Math.abs(dayjs(item.dateOut).month() - dayjs(item.dateIn).month())}`,
    lastPaid: item.RentalReservationReceipts.at(-1)?.totalAmount,
    lastPaidDate: dayjs(item.RentalReservationReceipts.at(-1)?.createdAt).format('DD/MM/YYYY'),
    dateOut: dayjs(item.dateOut).format('DD/MM/YYYY')
  })).reduce((acc, room) => {
    const index = parseInt(room.roomNumber) ? 0 : 1;
    acc[index].push(room);
    return acc;
  }, [[], []]).map(arr => arr.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))).flat();

  const handleView = (reservationId) => {
    navigate(`/dashboard/hotels/${id}/rental-room-reservations/${reservationId}`);
  };

  return (
    <PageWrapper title="Rental Income">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
          name="Rental Income"
          columns={columns}
          rows={rows}
          onView={handleView}
          mobileViewColumns={['roomNumber', 'paidAmount']}
        />
      )}
    </PageWrapper>
  );
};

export default RentalRoomReservations;
