import React from 'react';
import Loading from 'components/Loading';
import { useGetBalancesQuery } from './reportsApiSlice';
import { toast } from 'react-toastify';
import PageWrapper from '../layouts/PageWrapper';
import MaterialTable from 'components/MaterialTable';
import dayjs from 'dayjs';
import { currency } from 'store/constant';
const Balances = () => {
  const { data, isFetching } = useGetBalancesQuery();

  const rows = data?.map((balance) => ({
    ...balance,
    createdAt: dayjs.tz(dayjs(balance.createdAt)).format('DD/MM/YYYY HH:mm:ss')
  }));
  const columns = [
    {
      Header: 'ID',
      accessorKey: 'id'
    },
    {
      Header: `(${currency}) Total Expenses`,
      accessorKey: 'expense'
    },
    {
      Header: `(${currency}) Revenue`,
      accessorKey: 'revenue'
    },
    {
      Header: `(${currency}) Drawings`,
      accessorKey: 'drawings'
    },
    {
      Header: `(${currency}) Remaining Balance`,
      accessorKey: 'remainingBalance'
    },
    {
      Header: 'Created At',
      accessorKey: 'createdAt'
    }
  ];
  const handleDelete = async (id) => {
    try {
      await deleteBalance(id).unwrap();
    } catch (error) {
      toast.error('Something went wrong', {
        toastId: 'delete-balance',
        position: 'top-center'
      });
    }
  };

  return (
    <PageWrapper title="Balances">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
          name="Balances"
          columns={columns}
          rows={rows}
          onDelete={handleDelete}
          mobileViewColumns={['createdAt', 'remainingBalance']}
        />
      )}
    </PageWrapper>
  );
};

export default Balances;
