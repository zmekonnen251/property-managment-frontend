import * as React from 'react';
import { useGetHotelsReportQuery, useGetReportQuery } from './reportsApiSlice';
import { Box, Button, ButtonGroup, Container, Divider, Paper, Typography } from '@mui/material';
import Loading from 'components/Loading';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import MaterialTable from 'components/MaterialTable';
import BackButton from 'components/BackButton';
import { currency } from 'store/constant';

function HotelsReportTable({ hotelsReport, date }) {
  const rows = hotelsReport?.map((hotel) => {
    return {
      hotelName: hotel.hotelName,
      revenue: hotel.revenue,
      totalDrawings: hotel.totalDrawings,
      totalDefaultExpenses: hotel.totalDefaultExpenses,
      expenses: hotel.expenses,
      netRevenue: hotel.netRevenue
    };
  });
  const columns = [
    {
      Header: 'Property Name',
      accessorKey: 'hotelName'
    },
    {
      Header: `Total Revenue (${currency})`,
      accessorKey: 'revenue'
    },
    {
      Header: `Total Drawings (${currency})`,
      accessorKey: 'totalDrawings'
    },
    {
      Header: `Expenses (${currency})`,
      accessorKey: 'totalDefaultExpenses'
    },
    {
      Header: `Expenditure (${currency})`,
      accessorKey: 'expenses'
    },
    {
      Header: `Net Profit/Lose (${currency})`,
      accessorKey: 'netRevenue'
    }
  ];

  const columnsPdf = [
    {
      Header: 'Property Name',
      accessorKey: 'hotelName'
    },
    {
      Header: `(${currency}) Total Revenue`,
      accessorKey: 'revenue'
    },
    {
      Header: `(${currency}) Total Drawings`,
      accessorKey: 'totalDrawings'
    },
    {
      Header: `(${currency}) Expenses`,
      accessorKey: 'totalDefaultExpenses'
    },
    {
      Header: `(${currency}) Expenditure`,
      accessorKey: 'expenses'
    },
    {
      Header: `(${currency}) Net Profit/Lose`,
      accessorKey: 'netRevenue'
    },
    {
      Header: '---------',
      accessorKey: ''
    },
    {
      Header: '---------',
      accessorKey: ''
    }
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text(`Properties ${dayjs(date).format('MMMM-YYYY')} Monthly Report`, 20, 10);

    doc.autoTable({
      theme: 'grid',
      head: [columnsPdf.map((col) => col.Header)],
      columns: columnsPdf.map((col) => ({
        ...col,
        dataKey: col.accessorKey,
        cell: (row, col) => row[col.dataKey]
      })),

      footer: [[{ content: 'Footer', colSpan: 2, styles: { halign: 'center' } }]],

      body: rows,
      bodyStyles: {
        fontSize: 8,
        cellPadding: 1,
        halign: 'center',
        valign: 'middle',
        columnWidth: 'auto',
        lineWidth: 0.1
      },
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
        columnWidth: 'auto',
        lineWidth: 0.1
      },
      headStyles: {
        fontStyle: 'bold',
        fontSize: 7,
        halign: 'center',
        valign: 'middle',
        columnMinWidth: 40,
        columnMaxWidth: 30,
        columnGap: 2,
        overflow: 'linebreak',
        lineWidth: 0.1
      }
    });

    doc.save(`reports-${dayjs.tz().format('YYYY-MM-DD HH:mm')}.pdf`);
  };

  return (
    <Paper sx={{ marginBottom: 2, mt: 2 }} elevation={3}>
      <Typography variant="h6" sx={{ fontSize: '14px', px: 2, py: 1 }}>
        Properties {dayjs(date).format('MMMM-YYYY')} Monthly Report
      </Typography>
      <MaterialTable
        rows={rows}
        columns={columns}
        handleExport={downloadPdf}
        mobileViewColumns={['hotelName', 'expenses', 'netRevenue']}
        name="Properties Report"
        report
      />
    </Paper>
  );
}

const GeneralReport = ({ data }) => {
  const columns = [
    {
      Header: `Total Revenue (${currency})`,
      accessorKey: 'totalRevenue'
    },
    {
      Header: `Expenditure (${currency})`,
      accessorKey: 'totalExpenses'
    },
    {
      Header: `Total Salaries (${currency})`,
      accessorKey: 'totalSalaries'
    },
    {
      Header: `Net Profit/Lose (${currency})`,
      accessorKey: 'netRevenue'
    }
  ];

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text(`Reservations`, 20, 10);

    doc.autoTable({
      theme: 'grid',
      head: [columns.map((col) => col.Header)],
      columns: columns.map((col) => ({
        ...col,
        dataKey: col.accessorKey,
        cell: (row, col) => row[col.dataKey]
      })),

      footer: [[{ content: 'Footer', colSpan: 2, styles: { halign: 'center' } }]],

      body: data,
      bodyStyles: {
        fontSize: 8,
        cellPadding: 1,
        halign: 'center',
        valign: 'middle',
        columnWidth: 'auto',
        lineWidth: 0.1
      },
      styles: {
        fontSize: 8,
        cellPadding: 1,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle',
        columnWidth: 'auto',
        lineWidth: 0.1
      },
      headStyles: {
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        columnMinWidth: 10,
        columnMaxWidth: 30,
        columnGap: 2,
        overflow: 'linebreak',
        lineWidth: 0.1
      }
    });
    doc.save(`reports-${dayjs().format('YYYY-MM-DD HH:mm')}.pdf`);
  };

  return (
    <Paper elevation={3} sx={{ marginBottom: 2 }}>
      <MaterialTable
        rows={data}
        columns={columns}
        handleExport={downloadPdf}
        mobileViewColumns={['expenses', 'netRevenue']}
        name="General Report"
        report
      />
    </Paper>
  );
};

const Reports = () => {
  const [monthYear, setMonthYear] = React.useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day: new Date().getDate()
  });

  // const {
  // 	data: balances,
  // 	isLoading: balancesLoading,
  // 	isSuccess: balancesSuccess,
  // } = useGetBalancesQuery();
  const { data: report, isSuccess: reportSuccess } = useGetReportQuery(monthYear);
  const { data: hotelsReport, isLoading: hotelsReportLoading, isSuccess: hotelsReportSuccess } = useGetHotelsReportQuery(monthYear);

  if (hotelsReportLoading || !hotelsReportSuccess) return <Loading />;
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
          <Link to="/dashboard/reports/balances" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="success">
              Balances
            </Button>
          </Link>
        </ButtonGroup>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '14px' }}>
            Select A Month and Year
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ display: 'inline-block' }}>
            <DatePicker
              timezone="Africa/Johannesburg"
              openTo="month"
              label="Select A Month and Year"
              value={dayjs.tz(`${monthYear.year}-${monthYear.month}-${monthYear.day}`)}
              onChange={(date) => {
                setMonthYear({
                  month: dayjs.tz(date).month() + 1,
                  year: dayjs.tz(date).year(),
                  day: dayjs.tz(date).date()
                });
              }}
              views={['month', 'year']}
              slotProps={{ textField: { variant: 'outlined' } }}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Divider sx={{ my: 2, mx: 2 }} />
      {reportSuccess && <GeneralReport data={[report]} />}
      {hotelsReportSuccess && (
        <HotelsReportTable date={`${monthYear.year}-${monthYear.month}-${monthYear.day}`} hotelsReport={hotelsReport} />
      )}
    </Container>
  );
};

export default Reports;
