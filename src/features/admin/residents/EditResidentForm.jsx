import React from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField } from '@mui/material';
import { useUpdateResidentMutation } from './residentsApiSlice';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Update } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  optionalPhone: yup.string(),

  idNumber: yup.string().required('Id number is required'),
  idType: yup.string().required('Id type is required'),
  phone: yup.string().required('Phone is required')
});

const EditResidentForm = ({ defaultData }) => {
  const navigate = useNavigate();

  const [updateResident, { isLoading, isSuccess, reset }] = useUpdateResidentMutation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultData
    }
  });

  const onSubmit = async (data) => {
    const values = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== defaultData[key]) {
        values[key] = data[key];
      }
    });

    await updateResident({ id: defaultData.id, data: values });
  };

  if (isSuccess) {
    reset();
    toast.success('Resident updated successfully', {
      toastId: 'update-resdient-success',
      autoClose: 2000,
      onClose: () => navigate('/dashboard/residents')
    });
  }

  if (isLoading) {
    toast.loading('Updating resident', {
      toastId: 'update-resdient-info',
      isLoading: isLoading
    });
  }

  isSuccess && !isLoading && toast.dismiss('update-resdient-info');

  return (
    <Paper sx={{ padding: 2, maxWidth: '500px', mx: 'auto' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                defaultValue={getValues('idType')}
              >
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
            <Button disabled={isLoading} fullWidth variant="contained" type="submit" color="primary" endIcon={<Update />}>
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditResidentForm;
