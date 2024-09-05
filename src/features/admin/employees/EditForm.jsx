import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Chip from '@mui/material/Chip';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useUpdateEmployeeMutation } from './employeesApiSlice';

const roles = ['manager', 'receptionist', 'careTaker', 'cleaner', 'chef', 'owner', 'other'];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string(),
  hiredAt: yup.date().required('Hired at is required'),
  salary: yup.number().required('Salary is required'),
  role: yup.mixed().oneOf(roles, 'Role is required').required('Role is Required!'),
  password: yup.string(),
  hotels: yup.array().of(yup.number()),
  dateOfBirth: yup.date().required('Date of birth is required!')
});

const EditEmployeeForm = ({ defaultData, hotelsData }) => {
  const navigate = useNavigate();
  const [updateEmployee, { isLoading, isSuccess }] = useUpdateEmployeeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultData,
      hiredAt: dayjs(defaultData?.hiredAt).format('YYYY-MM-DD'),
      dateOfBirth: dayjs(defaultData?.dateOfBirth).format('YYYY-MM-DD')
    }
  });

  const onSubmit = async (data) => {
    const newValues = {};

    data.hiredAt = dayjs(data.hiredAt).format('YYYY-MM-DD');
    data.dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD');

    for (let i = 0; i < Object.keys(data).length; i++) {
      const key = Object.keys(data)[i];
      if (key === 'password' && data[key] === '') continue;

      if (data[key] !== defaultData[key]) {
        newValues[key] = data[key];
      }
    }

    await updateEmployee({ id: defaultData.id, data: newValues });
  };

  if (isSuccess) {
    toast.success('Employee Updated Successsfully!', {
      toastId: 'success2'
    });
    navigate('/dashboard/employees');
  }
  return (
    <Paper elevation={6} sx={{ px: 6, py: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Salary"
              type="number"
              {...register('salary')}
              error={!!errors.salary}
              helperText={errors.salary?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="hotels-select">Hotels</InputLabel>
              <Select
                labelId="hotels-select"
                id="hotels-select-chip"
                multiple
                {...register('hotels')}
                defaultValue={[]}
                input={<OutlinedInput id="select-hotels-chip" label="Hotel" />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <em>None</em>;
                  }

                  const selectedHotels = selected?.map((value) => hotelsData?.find((hotel) => hotel.id === value));
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedHotels?.map((value) => (
                        <Chip key={value} label={value.name} />
                      ))}
                    </Box>
                  );
                }}
                MenuProps={MenuProps}
              >
                {hotelsData?.map((hotel) => (
                  <MenuItem key={hotel} value={hotel.id}>
                    {hotel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Date of birth"
                    value={dayjs(field.value)}
                    views={['year', 'month', 'day']}
                    onChange={(e) => field.onChange(e)}
                    renderInput={(params) => (
                      <TextField {...params} margin="normal" error={!!errors.dateOfBirth} helperText={errors?.dateOfBirth?.message} />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                input={<OutlinedInput label="Role" />}
                MenuProps={MenuProps}
                {...register('role')}
                fullWidth
                defaultValue={getValues('role')}
                error={!!errors.role}
                helperText={errors?.role?.message}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats="YYYY-MM-DD">
              <Controller
                name="hiredAt"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Hired Date"
                    value={dayjs(field.value)}
                    views={['year', 'month', 'day']}
                    onChange={(e) => field.onChange(e)}
                    renderInput={(params) => (
                      <TextField {...params} margin="normal" error={!!errors.hiredAt} helperText={errors?.hiredAt?.message} />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="password">Password</InputLabel>
              <OutlinedInput
                {...register('password')}
                type="password"
                placeholder="********"
                label="Password"
                error={!!errors.password}
                helperText={errors.password?.message}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                labelId="password"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={6}>
              <Box sx={{ marginBottom: 2 }}>
                <LoadingButton fullWidth type="submit" variant="contained" loading={isLoading} loadingPosition="start" startIcon={<Save />}>
                  Save
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditEmployeeForm;
