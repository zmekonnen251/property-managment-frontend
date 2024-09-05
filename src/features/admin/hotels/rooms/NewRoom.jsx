import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, TextField, MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, Paper } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCreateRoomMutation } from './roomsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const schema = yup.object().shape({
  roomNumber: yup.string().required('Room number is required'),
  smoking: yup.boolean().required('Smoking is required'),
  status: yup.string().required('Status is required'),
  RoomTypeId: yup.string(),
  ready: yup.boolean().required('Is Ready is required')
});

const NewRoom = () => {
  const location = useLocation();
  const { id: hotelId } = useParams();
  const navigate = useNavigate();
  const { RoomTypeId } = location.state;
  const { RoomTypeName } = location.state;
  const [createRoom, { isLoading, isSuccess: isCreateRoomSuccess }] = useCreateRoomMutation();

  const { register, handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      RoomTypeId,
      ready: true,
      smoking: false,
      status: 'available'
    }
  });

  const onSubmit = async (values) => {
    await createRoom(values);
  };

  if (isCreateRoomSuccess) {
    toast.success('Room added successfully!', {
      toastId: 'room-created'
    });
    navigate(`/dashboard/hotels/${hotelId}/room-types/${RoomTypeId}`);
  }
  return (
    <PageWrapper title={`Add Room to ${RoomTypeName}`}>
      <Paper
        elevation={5}
        sx={{
          px: 4,
          py: 3,
          marginTop: 4
        }}
      >
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
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
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Controller
                {...register('ready')}
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
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Controller
                {...register('smoking')}
                id="smoking"
                control={control}
                render={({ field }) => {
                  const { onChange } = field;
                  return (
                    <FormControl fullWidth>
                      <InputLabel id="smoking-select">Smoking</InputLabel>
                      <Select
                        labelId="smoking-select"
                        id="smoking-select"
                        label="Smoking"
                        onChange={(e) => {
                          onChange(e.target.value);
                        }}
                      >
                        <MenuItem value>Smoking</MenuItem>
                        <MenuItem value={false}>Non-Smoking</MenuItem>
                      </Select>
                    </FormControl>
                  );
                }}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <FormControlLabel control={<Switch {...register('ready')} />} label="Ready" />
            </Grid>
            <Grid item xs={4}>
              <LoadingButton type="submit" endIcon={<Save />} loading={isLoading} loadingPosition="end" variant="contained">
                <span>Add Room</span>
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </PageWrapper>
  );
};

export default NewRoom;
