import React from 'react';

import MaterialTable from 'components/MaterialTable';
import dayjs from 'dayjs';
import Loading from 'components/Loading';
import 'jspdf-autotable';

import { useGetRentalRoomReservationReceiptsQuery } from './rentalRoomReservationsApiSlice';
import { useParams } from 'react-router-dom';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import { currency } from 'store/constant';

const columns = [
  {
    accessorKey: 'id',
    Header: 'ID'
  },
  {
    accessorKey: 'totalAmount',
    Header: `${currency} Paid Amount`
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

const RentalReceipts = () => {
  const { id, reservationId } = useParams();
  const { data, isFetching, isSuccess: isFetchSuccess } = useGetRentalRoomReservationReceiptsQuery({ id, reservationId });
  const rows = isFetchSuccess
    ? data?.map((row) => {
        return {
          ...row,
          residentName: `${row?.RentalRoomReservation.Resident?.firstName} ${row?.RentalRoomReservation.Resident?.lastName}`,
          rentalRoomNumber: row?.RentalRoomReservation.RentalRoom?.roomNumber,
          hotelName: row?.RentalRoomReservation.RentalRoom?.Hotel?.name
        };
      })
    : [];

  return (
    <PageWrapper title={`Receipts`}>
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
          columns={columns}
          rows={rows}
          name="lease unit reservation receipts"
          mobileViewColumns={['rentalRoomNumber', 'totalAmount']}
          back
        />
      )}
    </PageWrapper>
  );
};

export default RentalReceipts;
