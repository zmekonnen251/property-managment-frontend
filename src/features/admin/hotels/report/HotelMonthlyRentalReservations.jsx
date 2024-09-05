import * as React from 'react';
import { useGetHotelMonthlyRentalRoomReservationsQuery } from '../rentalRoomReservations/rentalRoomReservationsApiSlice';

import { Box, Button, Paper } from '@mui/material';

import dayjs from 'dayjs';

import MaterialReactTable from 'material-react-table';
import { PictureAsPdf } from '@mui/icons-material';
import CustomDatePicker from 'components/CustomDatePicker';
import exportPdfTable from 'utils/pdfTableExport';
import { currency } from 'store/constant';

const MonthlyRentalReservationsTable = ({ monthlyRentalRoomReservations, hotelName, type, date }) => {
  const rows = monthlyRentalRoomReservations.map((row) => {
    return {
      monthlyPayment: row?.RentalRoom?.rentAmount,
      dateIn: dayjs.tz(row?.dateIn).format('YYYY-MM-DD'),
      dateOut: dayjs.tz(row?.dateOut).format('YYYY-MM-DD'),
      roomNumber: row?.RentalRoom?.roomNumber,
      date: dayjs.tz(row?.date).format('DD-MMMM-YYYY'),
      id: row?.id,
      residentFullName: `${row.Resident.firstName} ${row.Resident.lastName}`
    };
  })?.reduce((acc, room) => {
    const index = parseInt(room.roomNumber) ? 0 : 1;
    acc[index].push(room);
    return acc;
  }, [[], []]).map(arr => arr.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))).flat();
  const total = monthlyRentalRoomReservations.reduce((acc, curr) => {
    return acc + curr.RentalRoom.rentAmount;
  }, 0);
  const columns = [
    {
      Header: 'Date',
      accessorKey: 'date'
    },
    {
      Header: 'Room Number',
      accessorKey: 'roomNumber'
    },

    {
      Header: 'Checked In',
      accessorKey: 'dateIn',
      Cell: ({ value }) => dayjs.tz(value).format('YYYY-MM-DD')
    },
    {
      Header: 'Checked Out',
      accessorKey: 'dateOut',
      Cell: ({ value }) => dayjs.tz(value).format('YYYY-MM-DD')
    },
    {
      Header: 'Resident',
      accessorKey: 'residentFullName'
    },
    {
      Header: () => (
        <Box
          // color="warning.main"
          sx={{ display: 'flex', justifyContent: 'flex-end', fontWeight: 'bold', textAlign: 'right' }}>
          ({currency}) Monthly Payment
        </Box>
      ),
      muiTableHeadCellProps: {
        align: 'right'
      },
      muiTableBodyCellProps: {
        align: 'right'
      },
      accessorKey: 'revenue',
      Cell: ({ row }) => (
        <Box
          // color="warning.main"
          sx={{ ml: 3, textAlign: 'right' }}>
          {parseFloat(row.original.monthlyPayment).toFixed(2)}
        </Box>
      ),
      Footer: () => {
        return (
          <Box sx={{ textAlign: 'right', fontWeight: 'bold' }}>
            Total :
            <Box
              // color="warning.main"
              sx={{ ml: 1, textAlign: 'right', display: 'inline-block' }}>
              {total?.toLocaleString?.('en-UK', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </Box>
          </Box>
        );
      },
      muiTableFooterCellProps: {
        align: 'right',
        textAlign: 'right'
      }
    }
  ];

  const hotelType = type === 'residential' ? 'leased-unit-rooms' : 'leased-unit-shops';

  const columnsPdf = [
    {
      Header: 'ID',
      accessorKey: 'id'
    },
    {
      Header: 'Date',
      accessorKey: 'date'
    },
    {
      Header: 'Room Number',
      accessorKey: 'roomNumber'
    },
    {
      Header: 'Checked In',
      accessorKey: 'dateIn'
    },
    {
      Header: 'Checked Out',
      accessorKey: 'dateOut'
    },
    {
      Header: 'Resident',
      accessorKey: 'residentFullName'
    },
    {
      Header: `(${currency}) Monthly Payment`,
      accessorKey: 'monthlyPayment'
    }
  ];

  const downloadPdf = () => {
    const title = `Property ${hotelName} ${date} Monthly ${hotelType} List`;
    const footer = ['', '', '', '', '', 'Total', total];
    const fileName = `property-${hotelName}-${date}-monthly-${hotelType}-${dayjs().format('YYYY-MM-DD HH:mm')}.pdf`;
    exportPdfTable(columnsPdf, rows, title, footer, fileName);
  };
  const renderTopToolbarCustomActions = () => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
        <Button
          // color="primary"
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={downloadPdf}
          startIcon={<PictureAsPdf />}
          variant="contained"
        >
          Export as PDF
        </Button>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ marginBottom: 2 }}>
      <MaterialReactTable
        data={rows}
        columns={columns.map((c) => ({
          ...c
        }))}
        renderTopToolbarCustomActions={renderTopToolbarCustomActions}
        muiTableProps={{
          sx: {
            border: '1px solid rgba(81, 81, 81, 1)'
          }
        }}
        muiTableHeadCellProps={{
          sx: {
            border: '1px solid rgba(81, 81, 81, 1)'
          }
        }}
        muiTableBodyCellProps={{
          sx: {
            border: '1px solid rgba(81, 81, 81, 1)'
          }
        }}
        enableColumnActions={false}
        enableColumnFilters={false}
        enableSorting={false}
      />
    </Paper>
  );
};

const HotelMonthlyRentalReservations = ({ id, hotelName, type }) => {
  const [monthYear, setMonthYear] = React.useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate()
  });

  const { data } = useGetHotelMonthlyRentalRoomReservationsQuery({
    monthYear,
    id
  });

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
      <CustomDatePicker
        onDateSelected={setMonthYear}
        openTo="month"
        views={['month', 'year']}
        value={monthYear}
        title={`Property ${hotelName} ${dayjs(`${monthYear.year}-${monthYear.month}-${monthYear.day}`).format('MMMM-YYYY')} Leased Unit ${type === 'residential' ? 'Rooms' : 'Shops'
          }`}
      />
      {data && (
        <MonthlyRentalReservationsTable
          monthlyRentalRoomReservations={data}
          type={type}
          hotelName={hotelName}
          date={dayjs(`${monthYear.year}-${monthYear.month}-${monthYear.day}`).format('MMMM,YYYY')}
        />
      )}
    </Paper>
  );
};

export default HotelMonthlyRentalReservations;
