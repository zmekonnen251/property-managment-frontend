import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';

import { useGetHotelsQuery, useDeleteHotelMutation } from './hotelsApiSlice';
import PageWrapper from '../layouts/PageWrapper';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import MaterialTable from 'components/MaterialTable';

const columns = [
  {
    Header: 'ID',
    accessorKey: 'id'
  },
  {
    Header: 'Name',
    accessorKey: 'name'
  },
  {
    Header: 'Type',
    accessorKey: 'type'
  },
  {
    Header: "Phone",
    accessorKey: "phone"
  },
  {
    Header: "Address",
    accessorKey: "address"
  },
  {
    Header: 'Created At',
    accessorKey: 'createdAt',
    Cell: ({ row }) => {
      return <div>{dayjs.tz(row.createdAt).format('DD/MM/YYYY HH:mm:ss')}</div>;
    }
  }
];

const Hotels = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const { data, isFetching } = useGetHotelsQuery();
  const [deleteHotel] = useDeleteHotelMutation();

  const handleView = (id) => {
    navigate(`/dashboard/hotels/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/dashboard/hotels/${id}/edit`);
  };

  const handleDelete = async (id) => {
    await deleteHotel(id);
  };

  return (
    <PageWrapper title="Properties">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
            name="properties"
          rows={data}
          columns={columns}
          onDelete={user.role === 'admin' && handleDelete}
          onView={handleView}
          onUpdate={['admin', 'manager'].includes(user.role) && handleUpdate}
          addNewLink={user.role === 'admin' && '/dashboard/hotels/new-hotel'}
          actions={['admin', 'manager'].includes(user.role)}
          mobileViewColumns={['name', 'type']}
        />
      )}
    </PageWrapper>
  );
};

export default Hotels;
