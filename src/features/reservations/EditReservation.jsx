import * as React from 'react';
import { Paper, Grid, Box, FormControl, InputLabel, MenuItem, Select, TextField, FormHelperText } from '@mui/material';
import Typography from '@mui/material/Typography';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import { useGetHotelQuery } from '../admin/hotels/hotelsApiSlice';
import { useFetchReservationQuery, useUpdateReservationMutation } from '../admin/hotels/reservations/reservationsApiSlice';
import BackButton from 'components/BackButton';
import { DatePicker } from '@mui/lab';
// TODO remove, this demo shouldn't need to reset the theme.

const schema = yup.object().shape({
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
    }),
  HotelId: yup.number().required('Hotel is required')
});
export default function EditReservation() {
  const navigate = useNavigate();
  const { id, reservationId } = useParams();
  // const { data: hotelData } = useGetHotelQuery(id);
  const [updateReservation, { isLoading, isSuccess }] = useUpdateReservationMutation();

  const { data: reservation, isSuccess: isReservationFetchSuccess } = useFetchReservationQuery(reservationId);
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rooms: reservation?.Rooms?.map((room) => room.id),
      dateIn: reservation?.dateIn,
      reservationDays: dayjs.tz(dayjs(reservation?.dateOut)).diff(reservation?.dateIn, 'day'),
      paidBy: [],
      status: [],
      HotelId: reservation?.HotelId
    }
  });
  // filter employess based on the role rececption1,reception2,caretaker
  const onSubmit = async (values) => {
    await updateReservation({ data: values, id: reservationId });
  };

  React.useEffect(() => {
    if (isReservationFetchSuccess) {
      reset({
        rooms: reservation?.Rooms?.map((room) => room.id),
        reservationDays: reservation?.reservationDays,
        dateIn: reservation?.dateIn,
        paidBy: reservation?.paidBy,
        status: reservation?.status,
        HotelId: reservation?.HotelId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReservationFetchSuccess, reset]);

  if (isSuccess) {
    toast.success('Room reserved successfully', {
      position: toast.POSITION.TOP_RIGHT,
      toastId: 'edit-reservation-success'
    });
    navigate(`/hotels/${id}/reservations/${reservationId}`);
  }
  const today = dayjs.tz(dayjs());

  return (
    <>
      {isReservationFetchSuccess && (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            py: 8,
            // paddingBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            maxWidth: {
              xs: '100%',
              sm: '70%',
              md: '70%',
              lg: '80%'
            },
            px: {
              xs: 3,
              sm: 0,
              md: 0,
              lg: 0
            },

            mx: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <BackButton />
          </Box>

          {isReservationFetchSuccess && (
            <>
              <Typography
                component="h1"
                variant="h5"
                sx={{
                  textTransform: 'uppercase',
                  my: {
                    xs: 2,
                    sm: 2,
                    md: 3,
                    lg: 4
                  },
                  textAlign: 'center'
                }}
              >
                Update Reservation {reservationId}
              </Typography>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                  flexDirection: {
                    xs: 'column',
                    sm: 'column',
                    md: 'row',
                    lg: 'row'
                  }
                }}
              >
                <Paper
                  elervetion={7}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.7
                  }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      textTransform: 'uppercase',
                      my: 1,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 15
                    }}
                  >
                    Reservation Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl required sx={{ width: '100%' }}>
                        <Controller
                          {...register('dateIn')}
                          required
                          control={control}
                          defaultValue={today}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                sx={{ width: '100%' }}
                                views={['year', 'month', 'day']}
                                timezone="Africa/Johannesburg"
                                label="Date In"
                                onChange={(newValue) => {
                                  field.onChange(newValue);
                                }}
                                disablePast
                                slotProps={{ textField: { variant: 'outlined' } }}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText error={!!errors.dateIn}>{errors?.dateIn?.message}</FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
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
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl required sx={{ width: '100%' }}>
                        <InputLabel id="status-select">Status</InputLabel>
                        <Select
                          labelId="status-select"
                          fullWidth
                          placeholder="Select status"
                          {...register('status')}
                          error={!!errors.status}
                          helperText={errors?.status?.message}
                          defaultValue={[getValues('status')]}
                          label="Status"
                        >
                          <MenuItem value="">Select Status</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="checkedIn">Checked In</MenuItem>
                          <MenuItem value="checkedOut">Checked Out</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {watch('status') === 'checkedIn' && (
                      <Grid item xs={6}>
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
                            defaultValue={getValues('paidBy')}
                          >
                            <MenuItem value="">Select paid by</MenuItem>
                            <MenuItem value="cash">Cash</MenuItem>
                            <MenuItem value="card">Card</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    <Grid item xs={6}>
                      <FormControl required sx={{ width: '100%' }}>
                        <InputLabel id="rooms-select">Rooms</InputLabel>
                        <Select
                          labelId="rooms-select"
                          label="Rooms"
                          fullWidth
                          {...register('rooms')}
                          error={!!errors.rooms}
                          helperText={errors?.rooms?.message}
                          multiple
                          defaultValue={[getValues('rooms')]}
                        >
                          <MenuItem value="">Select rooms</MenuItem>
                          {reservation?.Rooms?.map((room) => (
                            <MenuItem key={room.id} value={room.id}>
                              {room.roomNumber} - {room.RoomType.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              <LoadingButton
                type="submit"
                endIcon={<Save />}
                loading={isLoading}
                loadingPosition="end"
                variant="contained"
                sx={{
                  my: 4,
                  p: 2,
                  width: {
                    xs: '100%',
                    sm: '100%',
                    md: '50%',
                    lg: '20%'
                  }
                }}
              >
                Update Reservation
              </LoadingButton>
            </>
          )}
        </Box>
      )}
    </>
  );
}
