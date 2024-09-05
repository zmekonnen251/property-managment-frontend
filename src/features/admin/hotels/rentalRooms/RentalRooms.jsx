import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MaterialTable from 'components/MaterialTable';

import Loading from 'components/Loading';

import { useGetHotelRentalRoomsQuery, useDeleteRentalRoomMutation } from './rentalRoomsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import useAuth from 'hooks/useAuth';
import { useGetHotelQuery } from '../hotelsApiSlice';

const columns = [
  {
    Header: 'ID',
    accessorKey: 'id'
  },
  {
    Header: 'Room Number',
    accessorKey: 'roomNumber'
  },
  {
    Header: 'Property',
    accessorKey: 'hotelName'
  },
  {
    Header: 'Status',
    accessorKey: 'status'
  }
];
const RentalRooms = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isFetching } = useGetHotelRentalRoomsQuery(id);
  const { data: hotelData } = useGetHotelQuery(id);
  const [deleteRentalRoom] = useDeleteRentalRoomMutation();

  const rows = data?.data?.rentalRooms.map((rentalRoom) => ({
    ...rentalRoom,
    hotelName: rentalRoom.Hotel.name
  }))?.reduce((acc, room) => {
    const index = parseInt(room.roomNumber) ? 0 : 1;
    acc[index].push(room);
    return acc;
  }, [[], []]).map(arr => arr.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))).flat();

  const handleView = (rentalRoomId) => {
    navigate(`/dashboard/hotels/${id}/rental-rooms/${rentalRoomId}`);
  };
  const handleUpdate = (rentalRoomId) => {
    navigate(`/dashboard/hotels/${id}/rental-rooms/${rentalRoomId}/edit`);
  };

  const handleDelete = async (rentalRoomId) => {
    await deleteRentalRoom(rentalRoomId);
  };
  const handleAddNew = () => {
    navigate(`/dashboard/hotels/${id}/rental-rooms/new`, {
      state: {
        hotelType: hotelData.type
      }
    });
  };

  return (
    <PageWrapper title="Rental Rooms">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
          rows={rows}
          columns={columns}
          onDelete={['admin', 'manager'].includes(user.role) && handleDelete}
          onView={handleView}
          onUpdate={['admin', 'manager'].includes(user.role) && handleUpdate}
          onAddNew={['admin', 'manager'].includes(user.role) && handleAddNew}
          actions={['admin', 'manager'].includes(user.role)}
          mobileViewColumns={['roomNumber', 'status']}
        />
      )}
    </PageWrapper>
  );
};

export default RentalRooms;
