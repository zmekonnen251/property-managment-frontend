import React from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MaterialTable from 'components/MaterialTable';
import Loading from 'components/Loading';
import { useDeleteRoomTypeMutation, useFetchHotelRoomTypesQuery } from './roomsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import useAuth from 'hooks/useAuth';

const columns = [
  {
    Header: 'Id',
    accessorKey: 'id'
  },
  {
    Header: 'Name',
    accessorKey: 'name'
  },
  {
    Header: 'Number of Beds',
    accessorKey: 'numberOfBeds'
  },
  {
    Header: 'Capacity',
    accessorKey: 'capacity'
  },
  {
    Header: 'Default Price',
    accessorKey: 'defaultPrice'
  },
  {
    Header: 'Current Price',
    accessorKey: 'currentPrice'
  },
  {
    Header: 'Propery',
    accessorKey: 'Hotel.name'
  }
];

const RoomTypes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuth()
  const { data, isFetching } = useFetchHotelRoomTypesQuery(id);
  const [deleteRoomType] = useDeleteRoomTypeMutation();

  const handleView = (roomTypeId) => {
    navigate(`/dashboard/hotels/${id}/room-types/${roomTypeId}`);
  };

  const handleUpdate = (roomTypeId) => {
    navigate(`/dashboard/hotels/${id}/room-types/${roomTypeId}/edit`, {
      state: {
        ...data?.find((roomType) => roomType.id === roomTypeId)
      }
    });
  };

  const handleDelete = async (roomTypeId) => {
    await deleteRoomType(roomTypeId);
  };

  return (
    <PageWrapper title="Room Types">
      {isFetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Loading />
        </Box>
      ) : (
        <MaterialTable
          name="Room Types"
          rows={data}
          columns={columns}
          onDelete={handleDelete}
          onView={handleView}
          onUpdate={handleUpdate}
          addNewLink={`/dashboard/hotels/${id}/room-types/new`}
          actions={['admin', 'manager'].includes(user.role)}
          mobileViewColumns={['name', 'currentPrice', 'hotel']}
        />
      )}
    </PageWrapper>
  );
};

export default RoomTypes;
