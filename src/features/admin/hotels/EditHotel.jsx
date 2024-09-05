// Edit expense page
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useGetHotelQuery, useUpdateHotelMutation } from './hotelsApiSlice';
import Loading from '../../../components/Loading';
import PageWrapper from '../layouts/PageWrapper';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required')
});

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateHotel, { isSuccess, isLoading }] = useUpdateHotelMutation();
  const { data, isSuccess: isFetchSuccess } = useGetHotelQuery(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: data?.name,
      phone: data?.phone,
      address: data?.address,
    }
  });

  const onSubmit = async (data) => {
    await updateHotel({ hotelId: id, data });
  };

  useEffect(() => {
    if (isFetchSuccess) {
      reset({
        name: data.name,
        phone: data.phone,
        address: data.address
      });
    }
  }, [isFetchSuccess, data, reset]);

  if (isSuccess) {
    toast.success('Property updated successfully', {
      toastId: 'update-hotel-success',
      autoClose: 1500,
      onClose: () => navigate('/dashboard/hotels')
    });
  }

  return (
    <PageWrapper title={`Edit Property ${data?.name}`}>
      <Paper elevation={3} sx={{ padding: 2, maxWidth: '500px', mx: 'auto' }}>
        {isLoading && <Loading />}

        {!isLoading && <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Name"
              variant="outlined"
              focused
              fullWidth
              margin="normal"
              {...register('name')}
              error={!!errors.name}
              helperText={errors?.name?.message}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField focused fullWidth label="Phone" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message}
              defaultValue={data?.phone}
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label='Address'
              focused fullWidth error={!!errors.address} autoFocus  {...register('address')} helperText={errors.address?.message} />
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
          </Box>
        </form>
        }
      </Paper>
    </PageWrapper>
  );
};

export default EditHotel;
