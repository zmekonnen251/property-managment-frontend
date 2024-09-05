import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Paper, TextField, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { useCreateHotelMutation } from './hotelsApiSlice';
import PageWrapper from '../layouts/PageWrapper';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  type: yup.string().oneOf(['residential', 'shop', 'guest-house']).required('Type is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required')
});

export default function NewExpense() {
  const navigate = useNavigate();

  const [createHotel, { isLoading }] = useCreateHotelMutation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await createHotel(data).unwrap();
      toast.success('Property created successfully');
      navigate('/dashboard/hotels');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <PageWrapper title="New Property">
      <Paper elevation={3} sx={{ padding: 2, maxWidth: '500px', mx: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField fullWidth label="Property Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <FormControl required sx={{ width: '100%' }}>
              <InputLabel id="paidby-select">Type</InputLabel>
              <Select
                labelId="hotel-select"
                fullWidth
                placeholder="Select Type"
                {...register('type')}
                error={!!errors.type}
                helperText={errors?.type?.message}
                label="Property Type"
              >
                <MenuItem value="residential">Residential</MenuItem>
                <MenuItem value="shop">Shop</MenuItem>
                <MenuItem value="guest-house">Guest House</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField fullWidth label="Phone" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField fullWidth label="Address" {...register('address')} error={!!errors.address} helperText={errors.address?.message} />
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <LoadingButton fullWidth type="submit" variant="contained" loading={isLoading} loadingPosition="start" startIcon={<Save />}>
              Save
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </PageWrapper>
  );
}
