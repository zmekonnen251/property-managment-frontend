import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Loading from 'components/Loading';

import { useFetchHotelExpensesQuery, useDeleteExpenseMutation } from './expensesApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import MaterialTable from 'components/MaterialTable';
import { currency } from 'store/constant';
import useAuth from 'hooks/useAuth';

const columns = [
  {
    accessorKey: 'id',
    Header: 'ID'
  },
  {
    accessorKey: 'amount',
    Header: `Amount (${currency})`
  },
  {
    accessorKey: 'reason',
    Header: 'Reason'
  },
  {
    accessorKey: 'byWhom',
    Header: 'By Whom'
  },
  {
    accessorKey: 'receiptNumber',
    Header: 'Receipt Number'
  },
  {
    accessorKey: 'date',
    Header: 'Date'
  },
  {
    accessorKey: 'updatedAt',
    Header: 'Updated At'
  }
];

const Expenses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuth()

  const { data, isFetching } = useFetchHotelExpensesQuery(id);
  const [deleteExpense] = useDeleteExpenseMutation();

  const handleView = (expenseId) => {
    navigate(`/dashboard/hotels/${id}/expenses/${expenseId}`);
  };

  const handleUpdate = (expenseId) => {
    navigate(`/dashboard/hotels/${id}/expenses/${expenseId}/edit`);
  };

  const handleDelete = async (expenseId) => {
    await deleteExpense({ id: expenseId });
    toast.success('Expense deleted successfully', {
      toastId: 'delete-expense-success',
      autoClose: 1500
    });
  };

  const handleAddNew = () => {
    navigate(`/dashboard/hotels/${id}/expenses/new`, {
      state: { type: 'default' }
    });
  };
  const defaultExpense = data?.filter((r) => r.type === 'default');
  const rows = defaultExpense?.map((r) => ({
    ...r,
    date: dayjs.tz(dayjs(r.date)).format('DD/MM/YYYY HH:mm'),
    updatedAt: dayjs.tz(dayjs(r.updatedAt)).format('DD/MM/YYYY HH:mm')
  }));
  return (
    <PageWrapper title="Expenses">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
          name="expenses"
          rows={rows}
          columns={columns}
          onDelete={handleDelete}
          onView={handleView}
          onUpdate={handleUpdate}
          onAddNew={['admin', 'manager'].includes(user.role) && handleAddNew}
          mobileViewColumns={['reason', 'amount', 'date']}
          actions={['admin', 'manager'].includes(user.role)}
        />
      )}
    </PageWrapper>
  );
};

export default Expenses;
