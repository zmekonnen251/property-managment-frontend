import * as React from 'react';
import { useGetMonthlyHotelRentalRoomReservationReceiptsQuery } from '../hotelsApiSlice';

import { Box, Button, Paper, Typography, useTheme } from '@mui/material';

import dayjs from 'dayjs';

import MaterialReactTable from 'material-react-table';
import { PictureAsPdf } from '@mui/icons-material';
import CustomDatePicker from 'components/CustomDatePicker';
import exportPdfTable from 'utils/pdfTableExport';
import { currency } from 'store/constant';
const HotelMonthlyRentalReceiptsTable = ({
	monthlyRentalReceipts,
	hotelName,
	type,
	date,
}) => {
	const theme = useTheme();
	const rows = monthlyRentalReceipts
		.map((row) => {
			return {
				totalAmount: row?.totalAmount,
				paymentDate: dayjs(row?.paymentDate).format('YYYY-MM-DD'),
				roomNumber: row?.RentalRoomReservation.RentalRoom?.roomNumber,
				id: row?.id,
				residentFullName: `${row.Resident.firstName} ${row.Resident.lastName}`,
			};
		})
		.reduce(
			(acc, room) => {
				const index = parseInt(room.roomNumber) ? 0 : 1;
				acc[index].push(room);
				return acc;
			},
			[[], []]
		)
		.map((arr) =>
			arr.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))
		)
		.flat();

	const total = monthlyRentalReceipts.reduce((acc, curr) => {
		return acc + curr.totalAmount;
	}, 0);

	const columns = [
		{ Header: 'Id', accessorKey: 'id' },
		{
			Header: 'Payment Date',
			accessorKey: 'paymentDate',
		},
		{
			Header: 'Room Number',
			accessorKey: 'roomNumber',
		},

		{
			Header: 'Resident',
			accessorKey: 'residentFullName',
		},
		{
			Header: () => (
				<Box
					// color="warning.main"
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						fontWeight: 'bold',
						textAlign: 'right',
					}}
				>
					`(${currency}) Total Amount`
				</Box>
			),
			muiTableHeadCellProps: {
				align: 'right',
			},
			muiTableBodyCellProps: {
				align: 'right',
			},
			accessorKey: 'revenue',
			Cell: ({ row }) => (
				<Box
					// color="warning.main"
					sx={{ ml: 3, textAlign: 'right' }}
				>
					{parseFloat(row.original.totalAmount).toFixed(2)}
				</Box>
			),
			Footer: () => {
				return (
					<Box sx={{ textAlign: 'right', fontWeight: 'bold' }}>
						Total :
						<Box
							// color="warning.main"
							sx={{ ml: 1, textAlign: 'right', display: 'inline-block' }}
						>
							{total?.toLocaleString?.('en-UK', {
								style: 'currency',
								currency: currency,
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Box>
					</Box>
				);
			},
		},
	];

	const hotelType =
		type === 'residential' ? 'leased-unit-rooms' : 'leased-unit-shops';

	const columnsPdf = [
		{
			Header: 'ID',
			accessorKey: 'id',
		},
		{
			Header: 'Payment Date',
			accessorKey: 'paymentDate',
		},
		{
			Header: 'Room Number',
			accessorKey: 'roomNumber',
		},
		{
			Header: 'Resident',
			accessorKey: 'residentFullName',
		},
		{
			Header: `(${currency})Total Amount`,
			accessorKey: 'totalAmount',
		},
	];

	const downloadPdf = () => {
		const title = `Property ${hotelName} ${date} Monthly ${hotelType} List`;
		const footer = ['', '', '', 'Total', total];
		const fileName = `property-${hotelName}-${date}-monthly-${hotelType}-${dayjs().format(
			'YYYY-MM-DD HH:mm'
		)}.pdf`;
		exportPdfTable(columnsPdf, rows, title, footer, fileName);
	};
	const renderTopToolbarCustomActions = () => {
		return (
			<Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
				<Button
					color='primary'
					//export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
					onClick={downloadPdf}
					startIcon={<PictureAsPdf />}
					variant='contained'
				>
					<Typography
						sx={{
							[theme.breakpoints.down('sm')]: {
								display: 'none',
							},
						}}
					>
						Export PDF
					</Typography>
				</Button>
			</Box>
		);
	};

	return (
		<Paper elevation={3} sx={{ marginBottom: 2 }}>
			<MaterialReactTable
				data={rows}
				columns={columns.map((c) => ({
					...c,
				}))}
				renderTopToolbarCustomActions={renderTopToolbarCustomActions}
				muiTableProps={{
					sx: {
						border: '1px solid rgba(81, 81, 81, 1)',
					},
				}}
				muiTableHeadCellProps={{
					sx: {
						border: '1px solid rgba(81, 81, 81, 1)',
					},
				}}
				muiTableBodyCellProps={{
					sx: {
						border: '1px solid rgba(81, 81, 81, 1)',
					},
				}}
				enableColumnActions={false}
				enableColumnFilters={false}
				enableSorting={false}
			/>
		</Paper>
	);
};

const HotelMonthlyRentalReceipts = ({ id, hotelName, type }) => {
	const [monthYear, setMonthYear] = React.useState({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		day: new Date().getDate(),
	});

	const { data } = useGetMonthlyHotelRentalRoomReservationReceiptsQuery({
		monthYear,
		id,
	});

	return (
		<Paper elevation={3} sx={{ p: 1, width: '100%' }}>
			<CustomDatePicker
				openTo='month'
				views={['month', 'year']}
				onDateSelected={setMonthYear}
				value={monthYear}
				title={`Property ${hotelName} ${dayjs(
					`${monthYear.year}-${monthYear.month}-${monthYear.day}`
				).format('MMMM-YYYY')} Leased Unit ${
					type === 'residential' ? 'Rooms' : 'Shops'
				}`}
			/>
			{data && (
				<HotelMonthlyRentalReceiptsTable
					monthlyRentalReceipts={data}
					type={type}
					hotelName={hotelName}
					date={dayjs(
						`${monthYear.year}-${monthYear.month}-${monthYear.day}`
					).format('MMMM,YYYY')}
				/>
			)}
		</Paper>
	);
};

export default HotelMonthlyRentalReceipts;
