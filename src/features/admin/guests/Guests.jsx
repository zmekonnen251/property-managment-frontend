import React from 'react';
import Loading from 'components/Loading';

import PageWrapper from '../layouts/PageWrapper';
import { useFetchGuestsQuery } from './guestsApiSlice';
import MaterialTable from 'components/MaterialTable';

const guestsColumns = [
  {
    Header: 'ID',
    accessorKey: 'id'
  },
  {
    Header: 'Name',
    accessorKey: 'name'
  },
  {
    Header: 'Email',
    accessorKey: 'email'
  },
  {
    Header: 'Phone',
    accessorKey: 'phone'
  },
  {
    Header: 'Optional Phone',
    accessorKey: 'optionalPhone'
  },
  {
    Header: 'ID Type',
    accessorKey: 'idType'
  },
  {
    Header: 'ID Number',
    accessorKey: 'idNumber'
  }
];

const Guests = () => {
  const { data, isFetching } = useFetchGuestsQuery();
  const guestsRow = data?.map((guest) => {
    return {
      ...guest,
      name: `${guest.firstName} ${guest.lastName}`
    };
  });

  return (
    <PageWrapper title="Guests List">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable columns={guestsColumns} rows={guestsRow} name="Guests List" mobileViewColumns={['name', 'email', 'phone']} />
      )}
    </PageWrapper>
  );
};

export default Guests;
