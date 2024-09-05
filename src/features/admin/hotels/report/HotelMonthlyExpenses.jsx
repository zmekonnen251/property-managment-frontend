import * as React from 'react';
import { useGetHotelMonthlyExpensesQuery } from '../expenses/expensesApiSlice';
import { Box, Paper } from '@mui/material';
import dayjs from 'dayjs';
import exportPdfTable from 'utils/pdfTableExport';
import CustomDatePicker from 'components/CustomDatePicker';
import MaterialTable from 'components/MaterialTable';
import { currency } from 'store/constant';

function HotelExpensesTable({ expenses, hotelName, date, type }) {
	const rows = expenses
		.map((row) => {
			return {
				id: row?.id,
				date: dayjs(row?.date).format('DD-MM-YYYY'),
				reason: row?.reason,
				amount: row?.amount,
				receiptNumber: row?.receiptNumber,
			};
		})
		.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

	// Add a total footer for the material table
	const totalAmount = expenses?.reduce((acc, curr) => acc + curr?.amount, 0);
	const columnsPdf = [
		{
			Header: 'ID',
			accessorKey: 'id',
		},
		{
			Header: 'date',
			accessorKey: 'date',
		},
		{
			Header: 'Reason',
			accessorKey: 'reason',
		},
		{
			Header: 'Receipt Number',
			accessorKey: 'receiptNumber',
		},
		{
			Header: `Amount (${currency})`,
			accessorKey: 'amount',
		},
	];
	const columnsMui = [
		{
			Header: 'ID',
			accessorKey: 'id',
		},
		{
			Header: 'Date',
			accessorKey: 'date',
		},
		{
			Header: 'Reason',
			accessorKey: 'reason',
		},
		{
			Header: 'Receipt Number',
			accessorKey: 'receiptNumber',
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
					Amount (ZAR)
				</Box>
			),
			muiTableHeadCellProps: {
				align: 'right',
			},
			muiTableBodyCellProps: {
				align: 'right',
			},
			accessorKey: 'amount',
			Cell: ({ row }) => (
				<Box
					// color="warning.main"
					sx={{ ml: 3, textAlign: 'right' }}
				>
					{parseFloat(row.original.amount).toFixed(2)}
				</Box>
			),
			Footer: () => (
				<Box sx={{ textAlign: 'right', fontWeight: 'bold' }}>
					Total :
					<Box
						// color="warning.main"
						sx={{ ml: 1, textAlign: 'right', display: 'inline-block' }}
					>
						{totalAmount?.toLocaleString?.('en-UK', {
							style: 'currency',
							currency: currency,
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</Box>
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
		const title = `Property ${hotelName} ${date} Monthly ${
			type.charAt(0).toUpperCase() + type.slice(1, type.length)
		} Expenses List`;
		const footer = ['', '', 'Total Amount', totalAmount];
		const fileName = `property-${hotelName}-monthly-${
			type.charAt(0).toUpperCase() + type.slice(1, type.length)
		}-expenses-${dayjs(date).format('YYYY-MM-DD HH:mm')}.pdf`;
		exportPdfTable(columnsPdf, rows, title, footer, fileName);
	};

	return (
		<Paper elevation={3} sx={{ marginBottom: 2 }}>
			<MaterialTable
				rows={rows}
				columns={columnsMui}
				handleExport={downloadPdf}
				mobileViewColumns={['date', 'reason', 'amount']}
				name='Default Expense'
				report
			/>
		</Paper>
	);
}

const HotelMonthlyExpenses = ({ id, hotelName, type }) => {
	const [monthYear, setMonthYear] = React.useState({
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		day: new Date().getDate(),
	});

	const { data: monthlyExpenses } = useGetHotelMonthlyExpensesQuery({
		monthYear,
		id,
		type: type,
	});
	return (
		<Paper elevation={3} sx={{ width: '100%' }}>
			<CustomDatePicker
				openTo='month'
				views={['month', 'year']}
				onDateSelected={setMonthYear}
				value={monthYear}
				title={`${hotelName} ${dayjs(
					`${monthYear.year}-${monthYear.month}-${monthYear.day}`
				).format('MM-YYYY')} ${
					type.charAt(0).toUpperCase() + type.slice(1, type.length)
				} Expenses`}
			/>
			{monthlyExpenses && (
				<HotelExpensesTable
					expenses={monthlyExpenses.monthlyExpenses}
					type={monthlyExpenses.type}
					hotelName={hotelName}
					date={dayjs(
						`${monthYear.year}-${monthYear.month}-${monthYear.day}`
					).format('MMMM,YYYY')}
				/>
			)}
		</Paper>
	);
};

export default HotelMonthlyExpenses;
