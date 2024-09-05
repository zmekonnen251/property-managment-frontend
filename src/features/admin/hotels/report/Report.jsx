import * as React from 'react';
import { useGetHotelReportQuery } from 'features/admin/reports/reportsApiSlice';
import { Box, ButtonGroup, Container, Paper, Divider } from '@mui/material';
import Loading from 'components/Loading';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

import { Box, ButtonGroup, Container, Paper, Divider } from '@mui/material';

import HotelMonthlyRevenue from './HotelMonthlyRevenue';
import HotelMonthlyExpenses from './HotelMonthlyExpenses';
import HotelMonthlyRentalReceipts from './HotelMonthlyRentalReceipts';
import MaterialTable from 'components/MaterialTable';
import BackButton from 'components/BackButton';
import Loading from 'components/Loading';
import { useGetHotelReportQuery } from 'features/admin/reports/reportsApiSlice';
import { currency } from 'store/constant';

function HotelsReportTable({ hotelReport }) {
  const mobileColumns = ['date', 'totalExpenses'];
function HotelsReportTable({ hotelReport, hotel, date }) {
  const rows = [
    {
      date: dayjs(hotelReport.date).format('MMMM-YYYY'),
      hotelName: hotelReport.name,
      revenue: hotelReport.revenue ?? 0,
      netRevenue: hotelReport.netRevenue ?? 0,
      totalExpenses: hotelReport.expenses.totalExpenses ?? 0,
      totalDefaultExpenses: hotelReport.expenses.totalExpensesByType.default ?? 0,
      totalDrawings: hotelReport.expenses.totalExpensesByType.drawings ?? 0,
      ...hotelReport
    }
  ];

  const columns = [
    {
      Header: 'Date',
      accessorKey: 'date',
      Cell: ({ value }) => dayjs(value).format('YYYY-MM-DD')
    },
    {
      accessorKey: 'revenue',
      // Display none on mobile
      header: 'Total Revenue'
    },
    {
      header: 'Total Default Expenses',
      accessorKey: 'totalDefaultExpenses'
    },
    {
      header: 'Total Drawings',
      accessorKey: 'totalDrawings'
    },
    {
      header: 'Total Expenses',
      accessorKey: 'totalExpenses'
    },
    {
      header: 'Net Revenue',
      accessorKey: 'netRevenue'
    }
  ];
  return (
    <Paper sx={{ marginBottom: 2, mt: 2 }} elevation={3}>
      <MaterialTable rows={rows} columns={columns} mobileViewColumns={mobileColumns} name={'hotels-report'} />
    {
      Header: `(${currency}) Total Revenue`,
      accessorKey: 'revenue'
    },
    {
      Header: `(${currency}) Total Expenses`,
      accessorKey: 'totalDefaultExpenses'
    },
    {
      Header: `(${currency}) Total Drawings`,
      accessorKey: 'totalDrawings'
    },
    {
      Header: `(${currency}) Expenditure`,
      accessorKey: 'totalExpenses'
    },
    {
      Header: `(${currency})Net Profit/Lose`,
      accessorKey: 'netRevenue'
    }
  ];

  const columnsPdf = [
    {
      Header: 'Date',
      accessorKey: 'date',
    },
    {
      Header: 'Hotel Name',
      accessorKey: 'hotelName',
    },
    {
      Header: `(${currency}) Total Revenue`,
      accessorKey: 'revenue'
    },
    {
      Header: `(${currency}) Total Expenses`,
      accessorKey: 'totalDefaultExpenses'
    },
    {
      Header: `(${currency}) Total Drawings`,
      accessorKey: 'totalDrawings'
    },
    {
      Header: `(${currency}) Expenditure`,
      accessorKey: 'totalExpenses'
    },
    {
      Header: `(${currency})Net Profit/Lose`,
      accessorKey: 'netRevenue'
    },
  ];

  const downloadPdf = () => {
    const title = `Property ${hotel?.name} ${date} Monthly Report`;
    const footer = '';
    const fileName = `property-${hotel?.name}-${date}-daily-revenue-${dayjs().format('YYYY-MM-DD HH:mm')}.pdf`;
    exportPdfTable(columnsPdf, rows, title, footer, fileName);
  };

  return (
    <Paper sx={{ marginBottom: 2, mt: 2 }} elevation={3}>
      <MaterialTable rows={rows} columns={columns} mobileViewColumns={['date,netRevenue']} name={'hotels-report'} />
      <MaterialTable rows={rows} columns={columns} mobileViewColumns={['date,netRevenue']} name={'hotels-report'} handleExport={downloadPdf} />
    </Paper>
  );

}
    

const Reports = () => {
  const { id } = useParams();
  const [hotel, setHotel] = React.useState({
    id: id,
    name: '',
    type: ''
  });
  const [monthYear, setMonthYear] = React.useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate()
  });

  const {
    data,
    isLoading: hotelReportLoading,
    isSuccess: hotelReportSuccess
  } = useGetHotelReportQuery({ month: monthYear.month, year: monthYear.year, id: parseInt(id) });

  React.useEffect(() => {
    setHotel({
      id: id,
      name: data?.name,
      type: data?.type
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (hotelReportLoading || !hotelReportSuccess) return <Loading />;
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1,
          px: 2,
          borderRadius: '5px'
        }}
      >
        <ButtonGroup variant="contained" aria-label="contained primary button group" sx={{ gap: 3 }}>
          <BackButton />
        </ButtonGroup>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ display: 'inline-block' }}>
            <DatePicker
              openTo="month"
              label="Select A Month and Year"
              value={dayjs(`${monthYear.year}-${monthYear.month}-${monthYear.day}`)}
              onChange={(date) => {
                setMonthYear({
                  month: dayjs(date).month() + 1,
                  year: dayjs(date).year(),
                  day: dayjs(date).date()
                });
              }}
              views={['month', 'year']}
              slotProps={{ textField: { variant: 'outlined' } }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Divider sx={{ my: 2, mx: 2 }} />
      {data && <HotelsReportTable hotelReport={data} hotel={hotel}
        date={dayjs.tz(dayjs(`${monthYear.year}-${monthYear.month}-${monthYear.day}`)).format('MMMM,YYYY')}
      />}

      <Divider sx={{ my: 2, mx: 2 }} />

      {hotel.name && hotel.type === 'guest-house' && <HotelMonthlyRevenue id={id} hotelName={hotel.name} />}
      {hotel.name && <HotelMonthlyExpenses id={id} hotelName={hotel.name} type="default" />}
      {hotel.name && <HotelMonthlyExpenses id={id} hotelName={hotel.name} type="drawings" />}

      {hotel.name && hotel.type !== 'guest-house' && <HotelMonthlyRentalReceipts id={id} type={hotel?.type} hotelName={hotel?.name} />}
    </Container>
  );
};

export default Reports;
