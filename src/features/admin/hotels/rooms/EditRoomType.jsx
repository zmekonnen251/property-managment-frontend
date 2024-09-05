import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import Loading from 'components/Loading';
import { useFetchRoomTypeQuery, useUpdateRoomTypeMutation } from './roomsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const schema = yup.object().shape({
  name: yup.string(),
  defaultPrice: yup.string(),
  description: yup.string(),
  numberOfBeds: yup
    .number()
    .positive()
    .integer()
    .min(1, 'Min 1 bed'),
  capacity: yup.number().positive().integer().min(1, 'Min 1 person'),
  currentPrice: yup.number().positive(),
});

export default function EditRoomType() {
  const { id, roomTypeId } = useParams();
  const { data: roomTypeData, isSuccess: isFetchSuccess } = useFetchRoomTypeQuery(roomTypeId);
  const navigate = useNavigate();

  const [updateRoomType, { isLoading, isSuccess }] = useUpdateRoomTypeMutation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset

  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: roomTypeData?.name,
      description: roomTypeData?.description,
      defaultPrice: roomTypeData?.defaultPrice,
      currentPrice: roomTypeData?.currentPrice,
      numberOfBeds: roomTypeData?.numberOfBeds,
      capacity: roomTypeData?.capacity
    }
  });
  const onSubmit = async (values) => {
    await updateRoomType({ id: roomTypeId, data: values });
  };


  React.useEffect(() => {
    if (isFetchSuccess) {
      reset({
        name: roomTypeData.name,
        description: roomTypeData.description,
        defaultPrice: roomTypeData.defaultPrice,
        currentPrice: roomTypeData.currentPrice,
        numberOfBeds: roomTypeData.numberOfBeds,
        capacity: roomTypeData.capacity
      });
    }
  }, [isFetchSuccess, roomTypeData, reset]);

  if (isLoading || isSubmitting) {
    return <Loading />;
  }
  if (isSuccess) {
    toast.success('Room type updated successfully', {
      toastId: 'update-room-type-success'
    });
    navigate(`/dashboard/hotels/${id}/room-types/${roomTypeId}`);
  }
  return (
    <PageWrapper title="Edit Room Type">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <CssBaseline />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField required fullWidth id="name" label="Name" name="name" autoComplete="name" {...register('name')} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                focused

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
                focused

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
                focused

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
                focused

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
                focused

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

            <Grid item xs={6} sx={{ marginTop: 1 }}>
              <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary" fullWidth endIcon={<Save />}>
                UPDATE
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageWrapper>
  );
}
