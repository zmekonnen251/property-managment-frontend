import React from 'react';
import MaterialTable from 'components/MaterialTable';
import dayjs from 'dayjs';
import Loading from 'components/Loading';

import { useGetHotelRentalRoomReservationReceiptsQuery } from './rentalRoomReservationsApiSlice';
import { useParams } from 'react-router-dom';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const columns = [
  {
    accessorKey: 'id',
    Header: 'ID'
  },
  {
    accessorKey: 'totalAmount',
    Header: 'Paid Amount'
  },
  {
    accessorKey: 'paymentMethod',
    Header: 'Payment Method'
  },
  {
    accessorKey: 'rentalRoomNumber',
    Header: 'Room Number'
  },
  {
    accessorKey: 'residentName',
    Header: 'Resident Name'
  },
  {
    accessorKey: 'hotelName',
    Header: 'Hotel Name'
  },
  {
    accessorKey: 'date',
    Header: 'Date',
    Cell: ({ value }) => <div>{dayjs.tz(dayjs(value)).format('DD-MM-YYYY HH:mm')}</div>
  }
];

const RentalRoomReservationReceipts = () => {
  const { id } = useParams();
  const { data, isFetching, isSuccess: isFetchSuccess } = useGetHotelRentalRoomReservationReceiptsQuery(id);

  const rows = isFetchSuccess
    ? data?.map((row) => {
      return {
        ...row,
        residentName: `${row?.RentalRoomReservation.Resident?.firstName} ${row?.RentalRoomReservation.Resident?.lastName}`,
        rentalRoomNumber: row?.RentalRoomReservation.RentalRoom?.roomNumber,
        hotelName: row?.RentalRoomReservation.RentalRoom?.Hotel?.name
      };
    }).reduce((acc, room) => {
      const index = parseInt(room.rentalRoomNumber) ? 0 : 1;
      acc[index].push(room);
      return acc;
    }, [[], []]).map(arr => arr.sort((a, b) => parseInt(a.rentalRoomNumber.slice(1)) - parseInt(b.rentalRoomNumber.slice(1)))).flat()
    : [];

  return (
    <PageWrapper title="Rental Room Reservation Receipts">
      {isFetching ? <Loading /> : <MaterialTable columns={columns} rows={rows} name="lease unit reservation receipts" back={true} />}
    </PageWrapper>
  );
};

export default RentalRoomReservationReceipts;
