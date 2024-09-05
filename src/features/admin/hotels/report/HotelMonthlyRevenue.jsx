import * as React from 'react';

import { Box, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useGetHotelMonthlyRevenueQuery } from '../hotelsApiSlice';
import exportPdfTable from 'utils/pdfTableExport';
import CustomDatePicker from 'components/CustomDatePicker';
import MaterialTable from 'components/MaterialTable';
import { currency } from 'store/constant';

const HotelMonthlyRevenueTable = ({ monthlyRevenue, date, hotelName }) => {
	const rows = monthlyRevenue.map((row) => {
		return {
			date: row.date,
			revenue: row.revenue ?? 0,
		};
	});
	const totalRevenue = monthlyRevenue.reduce((acc, curr) => {
		return acc + curr.revenue;
	}, 0);

	const columnsPdf = [
		{
			Header: 'Date',
			accessorKey: 'date',
		},
		{
			Header: `(${currency}) Revenue `,
			accessorKey: 'revenue',
		},
	];
	const columns = [
		{
			Header: () => (
				<Box
					// color="warning.main"
					sx={{ fontWeight: 'bold', textAlign: 'left' }}
				>
					<Typography variant='h6'>
						Date{' '}
						<Typography
							variant='subtitle2'
							sx={{
								display: 'inline-block',
								// color: 'warning.main'
							}}
						>
							(YYYY-MM-DD)
						</Typography>
					</Typography>
				</Box>
			),
			header: 'Date',
			accessorKey: 'date',
		},

		{
			Header: () => (
				<Typography
					variant='subtitle2'
					// color="warning.main"
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						fontWeight: 'bold',
						textAlign: 'right',
						alignItems: 'flex-start',
					}}
				>
					{`(${currency}) Revenue`}
				</Typography>
			),
			header: 'Revenue (ZAR)',
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
					{parseFloat(row.original.revenue).toFixed(2)}
				</Box>
			),
			Footer: () => (
				<Box
					sx={{
						alignContent: 'right',
						alignmentBaseline: 'right',
						fontWeight: 'bold',
					}}
				>
					Total :
					<Typography
						// color="warning.main"
						sx={{ display: 'inline-block', ml: 2 }}
					>
						{totalRevenue?.toLocaleString?.('en-UK', {
							style: 'currency',
							currency: currency,
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</Typography>
				</Box>
			),
			muiTableFooterCellProps: {
				align: 'right',
				textAlign: 'right',
			},
		},
	];

	const downloadPdf = () => {
		const title = `Property ${hotelName} ${date} Daily Revenue Report`;
		const footer = ['Total Revenue:', `${currency} ${totalRevenue}`];
		const fileName = `property-${hotelName}-${date}-daily-revenue-${dayjs().format(
			'YYYY-MM-DD HH:mm'
		)}.pdf`;
		exportPdfTable(columnsPdf, rows, title, footer, fileName);
	};

	return (
		<Paper elevation={3} sx={{ marginBottom: 2 }}>
			<MaterialTable
				rows={rows}
				columns={columns}
				handleExport={downloadPdf}
				mobileViewColumns={['date', 'revenue']}
			/>
		</Paper>
	);
};

const HotelMonthlyRevenue = ({ id, hotelName }) => {
	const [monthYear, setMonthYear] = React.useState({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		day: new Date().getDate(),
	});

	const { data: monthlyRevenue } = useGetHotelMonthlyRevenueQuery({
		monthYear,
		id,
	});

	return (
		<Paper
			elevation={3}
			sx={{
				width: '100%',
			}}
		>
			<CustomDatePicker
				onDateSelected={setMonthYear}
				openTo='month'
				views={['month', 'year']}
				value={monthYear}
				title={`${hotelName} Monthly Revenue`}
			/>
			{monthlyRevenue && (
				<HotelMonthlyRevenueTable
					monthlyRevenue={monthlyRevenue}
					// type={monthlyExpenses.type}
					hotelName={hotelName}
					date={dayjs
						.tz(dayjs(`${monthYear.year}-${monthYear.month}-${monthYear.day}`))
						.format('MMMM,YYYY')}
				/>
			)}
		</Paper>
	);
};

export default HotelMonthlyRevenue;
