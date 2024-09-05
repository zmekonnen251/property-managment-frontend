import { Box, FormControl, InputLabel, MenuItem, Select, TableCell, TableRow, tableCellClasses } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import useAuth from 'hooks/useAuth';
import { useFetchRoomTypeQuery, useUpdateRoomMutation, useDeleteRoomMutation } from './roomsApiSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const RoomTableRow = ({ room }) => {
  const user = useAuth();
  const { data: roomType } = useFetchRoomTypeQuery(room?.RoomTypeId?.toString());

  const [updateRoom, { isLoading }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess }] = useDeleteRoomMutation();

  const handleReadyUpdate = async (roomId, isReady) => {
    await updateRoom({ id: roomId, data: { ready: isReady } });
  };

  const handleStatusUpdate = async (roomId, status) => {
    await updateRoom({ id: roomId, data: { status } });
  };

  const onDelete = async (roomId) => {
    await deleteRoom(roomId);
    if (isDeleteSuccess) {
      toast.success('Room deleted successfully');
    }
  };

  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row" align="left">
        {room?.roomNumber}
      </StyledTableCell>
      {user?.isAdmin ? (
        <StyledTableCell align="left">
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id="status-select">Status</InputLabel>
            <Select
              labelId="status-select"
              id="status-select"
              label="Status"
              defaultValue={room?.status}
              onChange={(e) => {
                handleStatusUpdate(room.id, e.target.value);
              }}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
        </StyledTableCell>
      ) : (
        <>
          {user.role !== 'cleaner' && (
            <TableCell TableCell align="left">
              {room?.status}
            </TableCell>
          )}
        </>
      )}
      {user.role !== 'cleaner' && <StyledTableCell align="left">{room?.smooking ? 'Smoking' : 'Non-smoking'}</StyledTableCell>}
      <TableCell align="left">{roomType?.name}</TableCell>
      {user.role !== 'cleaner' && <TableCell align="left">{room?.RoomType?.Hotel?.name}</TableCell>}
      {user?.isAdmin || user.role === 'cleaner' ? (
        <StyledTableCell align={user?.role === 'cleaner' ? 'center' : 'left'}>
          <FormControl sx={{ width: '70%' }}>
            <InputLabel id="status-select">Is Ready</InputLabel>
            <Select
              labelId="ready-select"
              id="ready-select"
              label="Is Ready"
              defaultValue={room?.ready}
              onChange={(e) => {
                handleReadyUpdate(room.id, e.target.value);
              }}
            >
              <MenuItem value>Ready</MenuItem>
              <MenuItem value={false}>Not-Ready</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ width: '15%' }}>{isLoading && <PulseLoader color="#26A65B" size="4px" />}</Box>
        </StyledTableCell>
      ) : (
        <StyledTableCell align="left">{room?.ready ? 'Ready' : 'Not-Ready'}</StyledTableCell>
      )}
      {user?.isAdmin && (
        <StyledTableCell align="left">
          <LoadingButton
            color="error"
            endIcon={<Delete />}
            loading={isDeleteLoading}
            loadingPosition="end"
            variant="contained"
            size="medium"
            onClick={() => onDelete(room?.id)}
          />
        </StyledTableCell>
      )}
    </StyledTableRow>
  );
};

export default RoomTableRow;
