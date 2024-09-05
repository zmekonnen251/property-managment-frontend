import MaterialTable from 'components/MaterialTable';
import React from 'react'
import dayjs from 'dayjs';

const HotelRentalReservations = ({ columns, rows, name, printLoading, handleRenewal, onPrint, handleUpdateUnpaid }) => {
  return (
    <MaterialTable
      name={
        name
      }
      columns={columns}
      rows={rows?.map((reservation) => {
        return {
          id: reservation.id,
          roomNumber: reservation.RentalRoom.roomNumber,
          resident: `${reservation.Resident.firstName} ${reservation.Resident.lastName}`,
          unpaidAmount: reservation.unpaidAmount,
          activePeriod: reservation.activePeriod,
          lastPaidAmount: reservation.RentalReservationReceipts.at(-1)?.totalAmount,
          paidBy: reservation.RentalReservationReceipts.at(-1)?.paymentMethod,
          lastPaidDate: dayjs.tz(reservation.RentalReservationReceipts.at(-1)?.paymentDate).format('DD/MM/YYYY'),
          status: reservation.status
        };
      })}
      mobileViewColumns={['roomNumber', 'status']}
      onPrint={onPrint}
      onUpdateUnpaid={handleUpdateUnpaid}
      onRenewal={handleRenewal}
      actions={true}
      printLoading={printLoading}
    />
  )
}

export default HotelRentalReservations