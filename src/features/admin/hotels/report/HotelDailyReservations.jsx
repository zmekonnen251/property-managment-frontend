import * as React from 'react';
import { useGetDailyReservationsQuery } from '../reservations/reservationsApiSlice';
import { Box, Paper } from '@mui/material';
import dayjs from 'dayjs';
import exportPdfTable from 'utils/pdfTableExport';
import CustomDatePicker from 'components/CustomDatePicker';
import MaterialTable from 'components/MaterialTable';
import { currency } from 'store/constant';

function HotelDailyReportTable({ dailyReservatons, hotelName, date }) {
	const rows = dailyReservatons
		.map((row) => {
			return {
				...row,
				roomNumbers: row?.roomNumbers?.join(', '),
				roomNumbersArr: row?.roomNumbers,
			};
		})
		?.reduce(
			(acc, room) => {
				const index = parseInt(room.roomNumber) ? 0 : 1;
				acc[index].push(room);
				return acc;
			},
			[[], []]
		)
		.map((arr) =>
			arr?.sort(
				(a, b) =>
					parseInt(a.roomNumbersArr[0]?.slice(1)) -
					parseInt(b.roomNumbersArr[0]?.slice(1))
			)
		)
		.flat();

	// Add a total footer for the material table
	const totalAmount = dailyReservatons?.reduce(
		(acc, curr) => acc + curr?.paidAmount,
		0
	);
	const columnsPdf = [
		{
			Header: 'ID',
			accessorKey: 'id',
		},
		{
			Header: 'Room Numbers',
			accessorKey: 'roomNumbers',
		},
		{
			Header: `(${currency}) Price`,
			accessorKey: 'paidAmount',
		},
	];
	const columnsMui = [
		{
			Header: 'ID',
			accessorKey: 'id',
		},
		{
			Header: 'Room Number',
			accessorKey: 'roomNumbers',
		},
		{
			Header: () => (
				<Box
					// color="warning.main"
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
						fontWeight: 'bold',
						textAlign: 'right',
					}}
				>
					({currency}) Price
				</Box>
			),
			muiTableHeadCellProps: {
				align: 'right',
			},
			muiTableBodyCellProps: {
				align: 'right',
			},
			accessorKey: 'paidAmount',

			Cell: ({ row }) => (
				<Box
					// color="warning.main"
					sx={{ ml: 3, textAlign: 'right' }}
				>
					{parseFloat(row.original.paidAmount).toFixed(2)}
				</Box>
			),

			Footer: () => (
				<Box
					// color="warning.main"
					sx={{ ml: -3, textAlign: 'right', display: 'inline-block' }}
				>
					Total :
					{totalAmount?.toLocaleString?.('en-UK', {
						style: 'currency',
						currency: currency,
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</Box>
			),
			muiTableFooterCellProps: {
				align: 'right',
				textAlign: 'right',
			},
		},
		// Footer for the total amount by summing up the paidAmount column
	];

	const downloadPdf = () => {
		const title = `Property ${hotelName} ${date} Reservations List`;
		const footer = ['', 'Total Amount', `${currency}${totalAmount}`];
		const fileName = `reports-${hotelName}-${dayjs(date).format(
			'YYYY-MM-DD HH:mm'
		)}.pdf`;
		exportPdfTable(columnsPdf, rows, title, footer, fileName);
	};

	return (
		<Paper elevation={3} sx={{ marginBottom: 2 }}>
			<MaterialTable
				rows={rows}
				columns={columnsMui}
				handleExport={downloadPdf}
				mobileViewColumns={['id', 'roomNumbers', 'paidAmount']}
			/>
		</Paper>
	);
}

const HotelDailyReservations = ({ id, hotelName }) => {
	const [monthYear, setMonthYear] = React.useState({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		day: new Date().getDate(),
	});

	const { data: dailyReservations } = useGetDailyReservationsQuery({
		monthYear,
		id,
	});

	return (
		<Paper elevation={3} sx={{ width: '100%', p: 2 }}>
			<CustomDatePicker
				onDateSelected={setMonthYear}
				value={monthYear}
				title={`${hotelName} ${dayjs(
					`${monthYear.year}-${monthYear.month}-${monthYear.day}`
				).format('DD-MM-YYYY')} Reservations`}
			/>
			{dailyReservations && (
				<HotelDailyReportTable
					dailyReservatons={dailyReservations}
					hotelName={hotelName}
					date={dayjs(
						`${monthYear.year}-${monthYear.month}-${monthYear.day}`
					).format('DD-MMMM-YYYY')}
				/>
			)}
		</Paper>
	);
};

export default HotelDailyReservations;
