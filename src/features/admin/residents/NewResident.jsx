import React, { useEffect } from 'react';
import PageWrapper from '../layouts/PageWrapper';
import { FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField } from '@mui/material';
import { useCreateResidentMutation } from './residentsApiSlice';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  optionalPhone: yup.string(),

  idNumber: yup.string().required('Id number is required'),
  idType: yup.string().required('Id type is required'),
  phone: yup.string().required('Phone is required')
});

const NewResident = () => {
  const navigate = useNavigate();
  const [createResident, { isLoading, isSuccess, reset }] = useCreateResidentMutation();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    await createResident(data);
  };
  useEffect(() => {
    if (isSuccess) {
      reset();
      toast.success('Resident created successfully', {
        toastId: 'new-resident-success',
        position: 'top-center',
        autoClose: 3000,
        onClose: () => {
          navigate('/dashboard/residents');
        }
      });
    }
  }, [isSuccess, navigate, reset]);
  return (
    <PageWrapper title={'New Resident'}>
      <Paper component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ padding: 2, maxWidth: '500px', mx: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoComplete="firstName"
              autoFocus
              {...register('firstName')}
              error={!!errors.firstName}
              helpertext={errors?.firstName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              autoComplete="lastName"
              autoFocus
              {...register('lastName')}
              error={!!errors.lastName}
              helpertext={errors?.lastName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl required sx={{ width: '100%' }}>
              <InputLabel id="phone">Phone</InputLabel>
              <OutlinedInput
                required
                fullWidth
                id="phone"
                label="Phone"
                autoComplete="phone"
                autoFocus
                {...register('phone')}
                error={!!errors.phone}
                helpertext={errors?.phone?.message}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="optionalPhone">Optional Phone</InputLabel>
              <OutlinedInput
                fullWidth
                id="optionalPhone"
                label="Optional Phone"
                autoComplete="optional-phone"
                autoFocus
                {...register('optionalPhone')}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="email">Email</InputLabel>
              <OutlinedInput
                fullWidth
                id="email"
                label="Email"
                autoComplete="email"
                autoFocus
                {...register('email')}
                error={!!errors.email}
                helpertext={errors?.email?.message}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl required sx={{ width: '100%' }}>
              <InputLabel id="idType">ID Type</InputLabel>
              <Select
                labelId="idType"
                {...register('idType')}
                placeholder="Select Id Type"
                error={!!errors.idType}
                helperText={errors?.idType?.message}
                label="ID Type"
              >
                <MenuItem value="">Select Id Type</MenuItem>
                <MenuItem value="idCard">Id Card</MenuItem>
                <MenuItem value="passport">Passport</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="idNumber"
              label="Id Number"
              autoComplete="idNumber"
              autoFocus
              {...register('idNumber')}
              error={!!errors.idNumber}
              helpertext={errors?.idNumber?.message}
            />
          </Grid>
          <Grid item xs={3}>
            <LoadingButton
              loading={isLoading}
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              endIcon={<Save />}
              loadingPosition="start"
            >
              Create
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>
    </PageWrapper>
  );
};

export default NewResident;
