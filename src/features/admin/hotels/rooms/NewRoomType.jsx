import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useCreateRoomTypeMutation } from './roomsApiSlice';
import Loading from 'components/Loading';
import Dropzone from 'components/Dropzone';
import { toast } from 'react-toastify';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  defaultPrice: yup.string().required('Price is required'),
  description: yup.string().required('Description is required'),
  numberOfBeds: yup.number().required().positive().integer().min(1, 'Min 1 bed'),
  capacity: yup.number().required().positive().integer().min(1, 'Min 1 person'),
  currentPrice: yup.number().positive().required('Current price is required'),
  cover: yup.string()
});

export default function NewRoomType() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [createRoomType, { isLoading, isSuccess }] = useCreateRoomTypeMutation();
  const [cover, setCover] = React.useState([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    if (cover.length > 0) {
      values.cover = cover[0];
    }
    values.HotelId = id;
    await createRoomType(values);
  };
  if (isSuccess) {
    toast.success('Room Type Created Successfully!', {
      toastId: 'new-room-type'
    });
    navigate(`/dashboard/hotels/${id}/room-types`);
  }

  if (isLoading || isSubmitting) {
    return <Loading />;
  }

  return (
    <PageWrapper title="Create New Room Type">
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField required fullWidth id="name" label="Name" name="name" autoComplete="name" {...register('name')} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              {...register('description')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              id="defaultPrice"
              type="number"
              label="Default Price"
              name="defaultPrice"
              autoComplete="defaultPrice"
              {...register('defaultPrice')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              id="currentPrice"
              label="Current Price"
              name="currentPrice"
              autoComplete="currentPrice"
              {...register('currentPrice')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              id="numberOfBeds"
              type="number"
              label="Number Of Beds"
              name="numberOfBeds"
              autoComplete="numberOfBeds"
              {...register('numberOfBeds')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              id="capacity"
              type="number"
              label="Capacity"
              name="capacity"
              autoComplete="capacity"
              {...register('capacity')}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ marginBottom: 2 }}>
              <Dropzone title="Upload Cover Image" setImageUrls={setCover} />
            </Box>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Create
        </Button>
      </Box>
    </PageWrapper>
  );
}
