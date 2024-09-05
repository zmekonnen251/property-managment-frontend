import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useGetHotelRoomsQuery } from '../hotelsApiSlice';
import MaterialTable from 'components/MaterialTable';
import Loading from 'components/Loading';

import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import { useDeleteRoomMutation, useUpdateRoomMutation } from './roomsApiSlice';

const columns = [
  {
    Header: 'Room No.',
    accessorKey: 'roomNumber'
  },
  {
    Header: 'Is Ready',
    accessorKey: 'ready',
    Cell: ({ row }) => <div>{row.original.ready ? 'Ready' : 'Not Ready'}</div>
  },
  {
    Header: 'Status',
    accessorKey: 'status'
  }
];
const Rooms = () => {
  const { id } = useParams();
  const theme = useTheme();
  const user = useAuth();
  const { data, isSuccess, isLoading } = useGetHotelRoomsQuery(id);
  const rooms = data?.reduce((acc, room) => {
    const index = parseInt(room.roomNumber) ? 0 : 1;
    acc[index].push(room);
    return acc;
  }, [[], []]).map(arr => arr.sort((a, b) => parseInt(a.roomNumber.slice(1)) - parseInt(b.roomNumber.slice(1)))).flat();

  let availableRooms = 0;

  if (isSuccess) {
    rooms?.forEach((a) => {
      if (a.status === 'available') {
        availableRooms += 1;
      }
    });
  }
  const readyRooms = rooms?.filter((room) => room.ready === true).length;
  const [updateRoom, { isUpdateRoomLoading }] = useUpdateRoomMutation();

  const [deleteRoom, { isSuccess: isDeleteSuccess }] = useDeleteRoomMutation();

  const handleChangeReady = async (roomId, isReady) => {
    await updateRoom({ id: roomId, data: { ready: isReady } });
  };

  const handleChangeStatus = async (roomId, value) => {
    const status = value ? 'available' : 'unavailable';
    await updateRoom({ id: roomId, data: { status } });
  };

  const onDelete = async (roomId) => {
    await deleteRoom(roomId);
    if (isDeleteSuccess) {
      toast.success('Room deleted successfully');
    }
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <PageWrapper title={`Rooms List`}>
      <Box>
        {isSuccess && (
          <Box
            sx={{
              my: {
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2
              }
            }}
          >
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box
                sx={{
                  p: 0.5,
                  display: 'flex',
                  // flexDirection: 'column',
                  // width: '80%'
                  gap: 3,
                  [theme.breakpoints.down('md')]: {
                    flexDirection: 'column',
                    gap: 1
                  }
                }}
              >
                <Typography sx={{ fontSize: 'inherit' }}>
                  <Typography variant="overline" sx={{ fontStyle: 'bold', mr: 2 }}>
                    Number of rooms:
                  </Typography>
                  {rooms?.length}
                </Typography>
                <Typography sx={{ fontSize: 'inherit' }}>
                  <Typography variant="overline" sx={{ fontStyle: 'bold', mr: 2 }}>
                    Available Rooms:{' '}
                  </Typography>
                  {availableRooms}
                </Typography>
                <Typography sx={{ fontSize: 'inherit' }}>
                  <Typography variant="overline" sx={{ fontStyle: 'bold', mr: 2 }}>
                    Number of Ready rooms:{' '}
                  </Typography>
                  {readyRooms}
                </Typography>
              </Box>
            </Box>

            <MaterialTable
              rows={rooms}
              columns={columns}
              onChangeReady={handleChangeReady}
              onChangeStatus={handleChangeStatus}
              name="rooms"
              mobileViewColumns={['roomNumber', 'status']}
              onDelete={onDelete}
              isRoomUpdateLoading={isUpdateRoomLoading}
              actions={['admin', 'manager'].includes(user.role)}
            />
          </Box>
        )}
      </Box>
    </PageWrapper>
  );
};

export default Rooms;
