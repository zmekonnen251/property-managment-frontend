import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  TextField
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import LoadingButton from '@mui/lab/LoadingButton';
import styled from '@emotion/styled';
import { useGetHotelRoomsQuery } from 'features/admin/hotels/hotelsApiSlice';
import { useLogoutMutation } from 'features/authentication/authApiSlice';
import { useCreateCleanedRoomsNoteMutation } from 'features/admin/hotels/hotelsApiSlice';

import Loading from '../components/Loading';

import RoomTableRow from 'features/admin/hotels/rooms/RoomTableRow';
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const Rooms = () => {
  const user = useAuth();
  const { id } = useParams();
  const { data: rooms, isSuccess, isLoading } = useGetHotelRoomsQuery(id);
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [createCleanedRoomsNote, { isLoading: isCreateNoteLoading, isSuccess: isCreateNoteSuccess }] = useCreateCleanedRoomsNoteMutation();
  const [cleanedRooms, setCleanedRooms] = useState('');
  const handleLogout = async () => {
    await logout();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCleanedRoomsNote({ id, data: { roomNumbers: cleanedRooms, HotelId: id } });
  };

  useEffect(() => {
    if (isCreateNoteSuccess) {
      setCleanedRooms('');
      toast.success('Note Created Successfully!', {
        toastId: 'cleaned-rooms-note',
        position: 'bottom-left'
      });
    }
  }, [isCreateNoteSuccess]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ maxWidth: '80%', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h2">Rooms</Typography>
        {/* a logout button  */}
        <LoadingButton variant="contained" size="large" color="error" onClick={handleLogout} endIcon={<Logout />} loading={isLogoutLoading}>
          Logout
        </LoadingButton>
      </Box>

      {isSuccess && (
        <Box sx={{ my: 2 }}>
          {isSuccess && rooms.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ mt: 2, width: '70%', maxWidth: '70vw' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="left">Room No</StyledTableCell>
                      {user.role !== 'cleaner' && <StyledTableCell align="left">Status</StyledTableCell>}
                      {user.role !== 'cleaner' && <StyledTableCell align="left">Smoking</StyledTableCell>}
                      <StyledTableCell align="left">Room Type</StyledTableCell>
                      {user.role !== 'cleaner' && <StyledTableCell align="left">Hotel</StyledTableCell>}
                      <StyledTableCell align={user?.role === 'cleaner' ? 'center' : 'left'}>Ready</StyledTableCell>
                      {user?.isAdmin && <StyledTableCell align="left">Actions</StyledTableCell>}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {rooms?.map((room) => (
                      <RoomTableRow key={room.id} room={room} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 4 }}
                component="form"
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Add Todays Cleaned Rooms"
                  value={cleanedRooms}
                  onChange={(e) => setCleanedRooms(e.target.value)}
                  sx={{
                    width: {
                      xs: '80%',
                      sm: '80%',
                      md: '60%',
                      lg: '70%'
                    }
                  }}
                  autoComplete={false}
                  placeholder="Add Todays Cleaned Rooms"
                  disabled={isCreateNoteLoading}
                />
                <LoadingButton loading={isCreateNoteLoading} type="submit" variant="contained" size="large" color="primary" sx={{ my: 3 }}>
                  Submit
                </LoadingButton>
              </Box>
            </>
          ) : (
            <Typography sx={{ textAlign: 'center' }}>There is no rooms yet!</Typography>
          )}
        </Box>
      )}
      {!isSuccess && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
            Something is wrong with the server, please try again later!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Rooms;
