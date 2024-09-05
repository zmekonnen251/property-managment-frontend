import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import * as yup from 'yup';

import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { useFetchReservationQuery, useUpdateReservationMutation } from './reservationsApiSlice';
import { useGetHotelQuery } from '../hotelsApiSlice';
import Loading from 'components/Loading';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string(),
  dateIn: yup.string().required('Date in is required'),
  reservationDays: yup.number().required('Reservation Days is required!'),
  rooms: yup.array().of(yup.number()).required('Rooms are required'),
  status: yup.string().oneOf(['pending', 'checkedIn', 'checkedOut']).required(),
  paidBy: yup
    .string()
    .oneOf(['cash', 'card'])
    .when('status', (status, schema) => {
      if (status === 'checkedIn') {
        return schema.required('Paid by is required');
      }
      return schema;
    })
});

// TODO remove, this demo shouldn't need to reset the theme.

export default function EditReservation() {
  const navigate = useNavigate();
  const { id, reservationId } = useParams();
  const { data: reservation, isSuccess: isReservationFetchSuccess, isFetching } = useFetchReservationQuery(reservationId);
  const [updateReservation, { isLoading, isSuccess }] = useUpdateReservationMutation();
  const { data: hotelData } = useGetHotelQuery(reservation?.HotelId);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rooms: [],
      status: reservation?.status,
      paidBy: 'card'
    }
  });

  const onSubmit = async (values) => {
    await updateReservation({ data: values, id: reservationId });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (isReservationFetchSuccess) {
      reset({
        firstName: reservation?.Guest.firstName,
        lastName: reservation?.Guest.lastName,
        paidAmount: reservation?.paidAmount,
        phone: reservation?.Guest?.phone,
        email: reservation?.Guest?.email,
        rooms: reservation?.Rooms.map((room) => room.id),
        dateIn: reservation?.dateIn,
        reservationDays: dayjs(reservation?.dateOut).diff(reservation?.dateIn, 'day'),
        paidBy: reservation?.paidBy,
        status: reservation?.status,
        HotelId: reservation?.HotelId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReservationFetchSuccess, reset]);

  if (isSuccess) {
    toast.success('Reservation updated successfully');
    navigate(`/dashboard/hotels/${id}/reservations`);
  }

  if (isFetching) return <Loading />;
  return (
    <PageWrapper title="Edit Reservation">
      {isReservationFetchSuccess && (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sm={6} lg={6}>
              <Paper
                elevation={5}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5
                }}
              >
                <Typography component="h1" variant="h5" sx={{ textTransform: 'uppercase' }}>
                  Customer
                </Typography>
                <TextField
                  required
                  margin="normal"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoComplete="firstName"
                  autoFocus
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors?.firstName?.message}
                />
                <TextField
                  required
                  margin="normal"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="lastName"
                  autoFocus
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors?.lastName?.message}
                />
                <TextField
                  required
                  margin="normal"
                  fullWidth
                  id="phone"
                  label="Phone"
                  autoComplete="phone"
                  autoFocus
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors?.phone?.message}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} sm={6} lg={6} spacing={3}>
              <Paper
                elervetion={5}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.7
                }}
              >
                <Typography component="h1" variant="h5" sx={{ textTransform: 'uppercase', mb: 1 }}>
                  Reservation
                </Typography>
                <FormControl required sx={{ width: '100%' }}>
                  <InputLabel id="status-select">Status</InputLabel>
                  <Select
                    labelId="status-select"
                    fullWidth
                    placeholder="Select status"
                    {...register('status')}
                    error={!!errors.status}
                    helperText={errors?.status?.message}
                    label="Status"
                    defaultValue={getValues('status')}
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="checkedIn">Checked In</MenuItem>
                    <MenuItem value="checkedOut">Checked Out</MenuItem>
                  </Select>
                </FormControl>
                <Controller
                  {...register('dateIn')}
                  required
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        required
                        timezone="Africa/Johannesburg"
                        label="Date In"
                        value={dayjs(field.value)}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  )}
                />
                <TextField
                  fullWidth
                  id="reservationDays"
                  label="Reservation Days"
                  autoComplete="reservationDays"
                  autoFocus
                  {...register('reservationDays')}
                  error={!!errors.reservationDays}
                  helperText={errors?.reservationDays?.message}
                />
                <FormControl required sx={{ width: '100%' }}>
                  <InputLabel id="rooms-select">Room Number</InputLabel>
                  <Select
                    labelId="rooms-select"
                    label="Rooms"
                    fullWidth
                    {...register('rooms')}
                    error={!!errors.rooms}
                    helperText={errors?.rooms?.message}
                    multiple
                    defaultValue={getValues('rooms')}
                  >
                    <MenuItem value="">Select rooms</MenuItem>
                    {hotelData?.availableRooms?.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.RoomType.name}-{room.roomNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {watch('status') === 'checkedIn' && (
                  <FormControl required sx={{ width: '100%' }}>
                    <InputLabel id="paidby-select">Paid By</InputLabel>
                    <Select
                      labelId="paidby-select"
                      fullWidth
                      placeholder="Select paid by"
                      {...register('paidBy')}
                      error={!!errors.paidBy}
                      helperText={errors?.paidBy?.message}
                      label="Paid By"
                      defaultValue="card"
                    >
                      <MenuItem value="">Select paid by</MenuItem>
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="card">Card</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={12} sm={12} lg={12}>
              <LoadingButton type="submit" endIcon={<Save />} loading={isLoading} loadingPosition="end" variant="contained">
                Update Reservation
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      )}
    </PageWrapper>
  );
}
