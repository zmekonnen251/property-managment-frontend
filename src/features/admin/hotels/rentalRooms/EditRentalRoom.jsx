import React, { useEffect } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRentalRoomQuery, useUpdateRentalRoomMutation } from './rentalRoomsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const schema = yup.object().shape({
  roomNumber: yup.string().required('Room number is required'),
  rentAmount: yup.number().required('Rent amount is required'),
  status: yup.mixed().oneOf(['available', 'unavailable'], 'Status is required')
});

const NewRentalRoom = () => {
  const navigate = useNavigate();
  const { id, rentalRoomId } = useParams();
  const { data, isSuccess: isRentalRoomFetchSuccess } = useGetRentalRoomQuery(rentalRoomId);

  const [updateRentalRoom, { isLoading, isSuccess: isCreateRoomSuccess }] = useUpdateRentalRoomMutation();

  const { register, handleSubmit, control, reset, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rentAmount: 0,
      status: 'available'
    }
  });

  const onSubmit = async (values) => {
    await updateRentalRoom(values);
  };
  useEffect(() => {
    if (isRentalRoomFetchSuccess) {
      reset({
        roomNumber: data.roomNumber,
        rentAmount: data.rentAmount,
        status: data.status
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRentalRoomFetchSuccess, data, reset]);

  if (isCreateRoomSuccess) {
    toast.success('Rental Room added successfully!', {
      onClose: () => {
        navigate(`/dashboard/hotels/${id}/rental-rooms`);
      },

      toastId: 'add-rental-room',
      position: 'top-center'
    });
  }

  return (
    <PageWrapper title="Update Rental Room">
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              id="roomNumber"
              label="Room Number"
              name="roomNumber"
              autoComplete="room-number"
              {...register('roomNumber')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="rentAmount"
              label="Rent Amount"
              type="number"
              name="rentAmount"
              autoComplete="rent-amount"
              {...register('rentAmount')}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              {...register('status')}
              id="status"
              control={control}
              render={({ field }) => {
                const { onChange } = field;
                return (
                  <FormControl fullWidth>
                    <InputLabel id="status-select">Status</InputLabel>
                    <Select
                      labelId="status-select"
                      id="status-select"
                      label="Status"
                      defaultValue={getValues('status')}
                      onChange={(e) => {
                        onChange(e.target.value);
                      }}
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="unavailable">Unavailable</MenuItem>
                    </Select>
                  </FormControl>
                );
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <LoadingButton type="submit" endIcon={<Save />} loading={isLoading} loadingPosition="end" variant="contained">
              Update
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </PageWrapper>
  );
};

export default NewRentalRoom;
