import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, TextField, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCreateRentalRoomMutation } from './rentalRoomsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const schema = yup.object().shape({
  roomNumber: yup.string().required('Room number is required'),
  rentAmount: yup.number().required('Rent amount is required'),
  status: yup.mixed().oneOf(['available', 'unavailable'], 'Status is required')
});

const NewRentalRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [createRentalRoom, { isLoading, isSuccess: isCreateRoomSuccess }] = useCreateRentalRoomMutation();
  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    values.HotelId = id;
    if (location.state.hotelType === 'shop') values.type = 'shop';
    if (location.state.hotelType === 'residential') values.type = 'residential';
    await createRentalRoom(values);
  };

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
    <PageWrapper title="Add Rental Room">
      <Paper elevation={2} sx={{ p: 2 }}>
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
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                id="rentAmount"
                label="Rent Amount"
                name="rentAmount"
                autoComplete="room-number"
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
                <span>Add Room</span>
              </LoadingButton>
              {/* <Button
									type='submit'
									variant='contained'
									size='medium'
									sx={{ mt: 3, mb: 2 }}
								>
									Add Room
								</Button> */}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </PageWrapper>
  );
};

export default NewRentalRoom;
