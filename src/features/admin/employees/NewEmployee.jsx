import React, { useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetHotelsQuery } from '../hotels/hotelsApiSlice';
import { Paper, TextField, Grid, MenuItem, Select, FormControl, Input, InputLabel } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useCreateEmployeeMutation } from './employeesApiSlice';
import PageWrapper from '../layouts/PageWrapper';

const roles = ['manager', 'receptionist', 'careTaker', 'cleaner', 'chef', 'owner', 'other'];

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string(),
  hiredAt: yup.date().required('Hired at is required'),
  salary: yup.number().required('Salary is required'),
  role: yup.string().required('Role is required'),
  password: yup.string().required('Password is required'),
  dateOfBirth: yup.date().required('Date of birth is required!'),
  hotelsId: yup.array(),
  photo: yup.mixed()
});

export default function NewEmployee() {
  const navigate = useNavigate();
  const [createEmployee, { isLoading, isSuccess }] = useCreateEmployeeMutation();
  const { data: hotels } = useGetHotelsQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === 'photo' && values.photo) {
        formData.append('photo', values.photo[0]);
      } else {
        formData.append(key, values[key]);
      }
    });

    await createEmployee(formData);
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success('Employee created successfully', {
        toastId: 'create-employee'
      });
      navigate('/dashboard/employees');
    }
  }, [isSuccess, navigate]);

  return (
    <PageWrapper title="New Employee">
      <Paper elevation={3} sx={{ padding: 2 }}>
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
              <TextField fullWidth label="Phone Number" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
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
              <TextField fullWidth label="Salary" {...register('salary')} error={!!errors.salary} helperText={errors.salary?.message} />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message}>
                      <DatePicker
                        sx={{ width: '100%' }}
                        label="Date of birth"
                        views={['year', 'month', 'day']}
                        renderInput={(props) => <TextField {...props} />}
                        value={dayjs(field.value).format('YYYY-MM-DD')}
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="roles-select">Role</InputLabel>

                <Select
                  {...register('role')}
                  labelId="role-select"
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  label="Role"
                  defaultValue="admin"
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
              <FormControl sx={{ width: '100%' }}>
                <InputLabel id="hotels-select">Hotels</InputLabel>
                <Select labelId="hotels-select" label="Hotels" fullWidth {...register('hotelsId')} multiple defaultValue={[]}>
                  {hotels?.map((hotel) => (
                    <MenuItem key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="hiredAt"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      views={['year', 'month', 'day']}
                      sx={{ width: '100%' }}
                      label="Hired at"
                      value={dayjs(field.value).format('YYYY-MM-DD')}
                      renderInput={(props) => <TextField {...props} />}
                      {...field}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={6}>
              {/* Material Ui file upload */}
              <Input type="file" name="photo" id="photo" {...register('photo')} accept="image/*" />
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={6}>
                <LoadingButton fullWidth type="submit" variant="contained" loading={isLoading} loadingPosition="start" startIcon={<Save />}>
                  Create Employee
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageWrapper>
  );
}
