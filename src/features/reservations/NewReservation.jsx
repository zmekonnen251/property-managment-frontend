import * as React from 'react';
import {
  Paper,
  Grid,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  ButtonGroup,
  FormHelperText,
  List,
  ListItemButton,
  ListItemText,
  ListItem
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { useGetHotelQuery, useGetHotelsQuery } from '../admin/hotels/hotelsApiSlice';
import { useCreateReservationMutation } from '../admin/hotels/reservations/reservationsApiSlice';
import { useFetchGuestsQuery } from '../admin/guests/guestsApiSlice';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material/styles';
import BackButton from 'components/BackButton';
import dayjs from 'dayjs';
// TODO remove, this demo shouldn't need to reset the theme.

export default function NewReservation() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [hotelId, setHotelId] = React.useState(id);
  const { data: hotelsData, isSuccess: hotelsIsSuccess } = useGetHotelsQuery();

  const { data } = useGetHotelQuery(hotelId);
  const [search, setSearch] = React.useState('');
  const [searchedGuests, setSearchedGuests] = React.useState(null);
  const [guest, setGuest] = React.useState(null);
  const [showSearchGuest, setShowSearchGuest] = React.useState(false);
  const [showGuestForm, setShowGuestForm] = React.useState(false);
  const [createReservation, { data: reservationData, isLoading, isSuccess }] = useCreateReservationMutation();
  const { data: guests } = useFetchGuestsQuery();
  const schema = yup.object().shape({
    dateIn: yup.string().required('Date in is required'),
    reservationDays: yup.number().required('Reservation Days is required!'),
    rooms: yup.array().of(yup.number()).required('Rooms are required'),
    status: yup.string().oneOf(['pending', 'checkedIn']).required(),
    paidBy: yup
      .string()
      .oneOf(['cash', 'card'])
      .when('status', (status, schema) => {
        if (status === 'checkedIn') {
          return schema.required('Paid by is required');
        }
        return schema;
      }),
    HotelId: yup.number().required('Hotel is required'),
    GuestId: yup.number(),
    firstName: yup.string().when('GuestId', (GuestId, schema) => {
      if (!GuestId) {
        return schema.required('First name is required');
      }
      return schema;
    }),
    lastName: yup.string().when('GuestId', (GuestId, schema) => {
      if (!GuestId) {
        return schema.required('Last name is required');
      }
      return schema;
    }),

    idNumber: yup.string().when('GuestId', (GuestId, schema) => {
      if (!GuestId) {
        return schema.required('Id number is required');
      }
      return schema;
    }),
    idType: yup.string().when('GuestId', (GuestId, schema) => {
      if (!GuestId) {
        return schema.required('Id type is required');
      }
      return schema;
    }),
    phone: yup.string().when('GuestId', (GuestId, schema) => {
      if (!GuestId) {
        return schema.required('Phone is required');
      }
      return schema;
    }),
    optionalPhone: yup.string(),
    email: yup.string()
  });

  const {
    register,
    unregister,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      HotelId: parseInt(id),
      GuestId: guest?.id
    }
  });

  // filter employess based on the role rececption1,reception2,caretaker
  const onSubmit = async (values) => {
    values.HotelId = hotelId;
    if (values.rooms.length === 0)
      toast.error('Please select room!', {
        toastId: 'create-reservation-error',
        position: 'bottom-right',
        autoClose: 2000
      });
    await createReservation(values);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchGuest = (search) => {
    const searchTrimmed = search.trim();
    setSearch(searchTrimmed);
    if (searchTrimmed.length === 0) {
      setSearchedGuests(null);
      return;
    }

    let filteredGuests = [];
    const filteredByFirstName = guests.filter((guest) => guest.firstName.toLowerCase().includes(search.toLowerCase()));

    const filteredByLastName = guests.filter((guest) => guest.lastName.toLowerCase().includes(search.toLowerCase()));

    filteredGuests = [...filteredByFirstName, ...filteredByLastName].filter(
      (guest, index, self) => index === self.findIndex((t) => t.id === guest.id)
    );

    if (filteredGuests.length === 0) {
      const firstName = search.split(' ')[0];
      const lastName = search.split(' ')[1];
      filteredGuests = guests.filter(
        (guest) =>
          guest.firstName.toLowerCase().includes(firstName.toLowerCase()) && guest.lastName.toLowerCase().includes(lastName.toLowerCase())
      );
    }

    // remove duplicates
    filteredGuests = filteredGuests.filter((guest, index, self) => index === self.findIndex((t) => t.id === guest.id));

    setSearchedGuests(filteredGuests);
  };

  React.useEffect(() => {
    // search for guests
    if (search) {
      handleSearchGuest(search);
    }
  }, [handleSearchGuest, search]);

  React.useEffect(() => {
    if (guest) {
      reset({
        GuestId: guest?.id,
        HotelId: hotelId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guest, hotelId]);

  if (isSuccess) {
    toast.success('Room reserved successfully', {
      onClose: () => {
        navigate(`/hotels/${hotelId}/reservations/${reservationData?.id}`);
      },
      autoClose: 2000,
      toastId: 'create-reservation',
      position: 'top-center'
    });
    navigate(`/hotels/${hotelId}/reservations/${reservationData?.id}`);
  }
  const today = dayjs.tz(dayjs());

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          width: {
            lg: '80%',
            md: '90%',
            xs: '100%'
          },
          mt: 2,
          mb: 2,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          maxWidth: {
            lg: '1100px',
            md: '1100px',
            xs: '100%'
          },
          minWidth: {
            lg: '1100px',
            md: '1100px',
            xs: '100%'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: {
                lg: 100,
                xs: 50
              }
            }}
          >
            <BackButton />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            component="h1"
            variant="h2"
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
            Create new reservation
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            py: 8,
            // paddingBottom: 8,
            display: 'flex',
            flexDirection: 'column',

            px: {
              xs: 2,
              sm: 2,
              md: 3,
              lg: 4
            },

            mx: 'auto'
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Paper
                elervetion={5}
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
                  Guest Information
                </Typography>

                {/* First search the user if the guest already exists */}
                {/* Buttons for giving an option for a receptionist if the guest is existing or new */}
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined primary button group"
                  sx={{
                    display: 'flex',
                    // gap: 2,
                    my: 2
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setShowSearchGuest(false);
                      setGuest(null);
                      setShowGuestForm(true);
                    }}
                  >
                    New Guest
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setShowSearchGuest(true);
                      unregister('firstName');
                      unregister('lastName');
                      unregister('idNumber');
                      unregister('idType');
                      unregister('phone');
                      unregister('optionalPhone');
                      unregister('email');
                      setShowGuestForm(false);
                    }}
                  >
                    Existing Guest
                  </Button>
                </ButtonGroup>
                {showSearchGuest && (
                  <TextField
                    placeholder="Search Guest"
                    fullwidth
                    onChange={(e) => handleSearchGuest(e.target.value)}
                    sx={{
                      '& .MuiInputBase-input': {
                        padding: theme.spacing(2, 2, 2, 0),
                        // vertical padding + font size from searchIcon
                        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                        paddingRight: `calc(1em + ${theme.spacing(4)})`,

                        transition: theme.transitions.create('width'),
                        width: '90%'
                      }
                    }}
                  />
                )}
                {searchedGuests && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      mt: 2,
                      // show scroll only if the content is greater than the height
                      overflowY: searchedGuests.length > 5 ? 'scroll' : 'hidden',
                      maxHeight: '250px'
                    }}
                  >
                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{
                        textTransform: 'uppercase',
                        my: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15
                      }}
                    >
                      (Search Result) Guests List
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mt: 2
                      }}
                    >
                      <List
                        sx={{
                          width: '100%',
                          maxWidth: 360,
                          bgcolor: 'background.paper'
                        }}
                      >
                        {searchedGuests.map((guest) => (
                          <ListItem
                            key={guest.id}
                            disablePadding
                            onClick={() => {
                              setGuest(guest);
                              setShowGuestForm(false);
                              setShowSearchGuest(false);
                              // When a guest is selected, reset the guests list
                              setSearchedGuests(null);
                            }}
                          >
                            <ListItemButton>
                              <ListItemText primary={`${guest.firstName} ${guest.lastName}`} secondary={guest.phone} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                )}

                {guest && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      mt: 2
                    }}
                  >
                    <Typography
                      component="p"
                      variant="body1"
                      sx={{
                        textTransform: 'uppercase',
                        my: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15
                      }}
                    >
                      {guest.firstName} {guest.lastName}
                    </Typography>

                    <Typography
                      component="p"
                      variant="body1"
                      sx={{
                        textTransform: 'uppercase',
                        my: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15
                      }}
                    >
                      {guest.phone}
                    </Typography>
                    <Typography
                      component="p"
                      variant="body1"
                      sx={{
                        textTransform: 'uppercase',
                        my: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15
                      }}
                    >
                      {guest.email}
                    </Typography>
                  </Box>
                )}
                {showSearchGuest && !searchedGuests && search.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      mt: 2
                    }}
                  >
                    <Typography
                      component="h3"
                      variant="h6"
                      sx={{
                        textTransform: 'uppercase',
                        my: 1,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15
                      }}
                    >
                      There is no guest with this information: {search}
                      <em style={{ display: 'block' }}> Please fill the form below to create a new guest</em>
                    </Typography>
                  </Box>
                )}
                {showGuestForm && (
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoComplete="firstName"
                        autoFocus
                        {...register('firstName')}
                        error={!!errors.firstName}
                        helperText={errors?.firstName?.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lastName"
                        autoFocus
                        {...register('lastName')}
                        error={!!errors.lastName}
                        helperText={errors?.lastName?.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        fullWidth
                        id="phone"
                        label="Phone"
                        name="phone"
                        autoComplete="phone"
                        autoFocus
                        {...register('phone')}
                        error={!!errors.phone}
                        helperText={errors?.phone?.message}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="optionalPhone"
                        label="Optional Phone"
                        name="optionalPhone"
                        autoComplete="optional-phone"
                        autoFocus
                        {...register('optionalPhone')}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                      />
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
                        name="idNumber"
                        autoComplete="idNumber"
                        autoFocus
                        {...register('idNumber')}
                        error={!!errors.idNumber}
                        helperText={errors?.idNumber?.message}
                      />
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
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
                  {!id && (
                    <Grid item xs={6}>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="hotel-select">Hotel</InputLabel>
                        <Select
                          labelId="hotel-select"
                          fullWidth
                          placeholder="Select Hotel"
                          onChange={(e) => setHotelId(e.target.value)}
                          value={hotelId}
                          error={!!errors.HotelId}
                        >
                          {hotelsIsSuccess &&
                            hotelsData?.map((hotel) => (
                              <MenuItem key={hotel.id} value={hotel.id}>
                                {hotel.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
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
                        label="Status"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="checkedIn">Checked In</MenuItem>
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
                        >
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
                        labelId="paidby-select"
                        label="Rooms"
                        fullWidth
                        {...register('rooms')}
                        error={!!errors.rooms}
                        helperText={errors?.rooms?.message}
                        multiple
                        defaultValue={[]}
                      >
                        {data?.availableRooms?.map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            {room?.RoomType?.name}-{room.roomNumber}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
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
            Create Reservation
          </LoadingButton>
        </Box>
      </Paper>
    </Box>
  );
}
