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
  FormHelperText,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';

import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useGetHotelRentalRoomsQuery } from '../rentalRooms/rentalRoomsApiSlice';
import { useCreateRentalRoomReservationMutation } from './rentalRoomReservationsApiSlice';
import { useFetchResidentsQuery } from '../../residents/residentsApiSlice';
import FileUploadComponent from 'components/FileUploadComponent';
import { useCallback } from 'react';
import PageWrapper from 'features/admin/layouts/PageWrapper';

export default function NewRentalRoomReservation() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const [createRentalRoomReservation, { isLoading, isSuccess }] = useCreateRentalRoomReservationMutation();
  const { data } = useGetHotelRentalRoomsQuery(id);
  const { data: residents } = useFetchResidentsQuery();
  const [contractUrl, setContractUrl] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [searchedResidents, setSearchedResidents] = React.useState(null);
  const [resident, setResident] = React.useState(null);
  const schema = yup.object().shape({
    email: yup.string(),
    dateIn: yup.string().required('Date in is required!'),
    paymentMethod: yup.string().required('Payment Method is required!'),
    paidAmount: yup.string().required('Paid amount is required!'),
    roomId: yup.string().required('Room id is required!'),
    contractPeriod: yup.number().required('Contract Period is required!'),
    activePeriod: yup.number().required('Active Period Period is required!'),
    deposit: yup.number().required('Deposit is required!'),
    ResidentId: yup.number(),
    contract: yup.string().required('Contract is required!')
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ResidentId: resident?.id,
      contract: contractUrl
    }
  });

  const onSubmit = async (values) => {
    // if (contractUrl) values.contract = contractUrl;
    if (values.activePeriod > values.contractPeriod) {
      toast.error('Active period cannot be greater than contract period', {
        toastId: 'active-period-error',
        position: 'top-center'
      });
    } else if (values.activePeriod <= values.contractPeriod) {
      await createRentalRoomReservation(values);
    }
  };

  const handleSearchResident = useCallback(
    (search) => {
      const searchTrimmed = search.trim();
      setSearch(searchTrimmed);
      if (searchTrimmed.length === 0) {
        setSearchedResidents(null);
        return;
      }

      let filteredResidents = [];
      const filteredByFirstName = residents.filter((resident) => resident.firstName.toLowerCase().includes(search.toLowerCase()));

      const filteredByLastName = residents.filter((resident) => resident.lastName.toLowerCase().includes(search.toLowerCase()));

      filteredResidents = [...filteredByFirstName, ...filteredByLastName].filter(
        (resident, index, self) => index === self.findIndex((t) => t.id === resident.id)
      );

      if (filteredResidents.length === 0) {
        const firstName = search.split(' ')[0];
        const lastName = search.split(' ')[1];
        filteredResidents = residents.filter(
          (resident) =>
            resident.firstName.toLowerCase().includes(firstName.toLowerCase()) &&
            resident.lastName.toLowerCase().includes(lastName.toLowerCase())
        );
      }

      filteredResidents = filteredResidents.filter((resident, index, self) => index === self.findIndex((t) => t.id === resident.id));

      setSearchedResidents(filteredResidents);
    },
    [residents]
  );

  React.useEffect(() => {
    if (search) {
      handleSearchResident(search);
    }
  }, [handleSearchResident, search]);

  React.useEffect(() => {
    if (contractUrl) {
      reset({
        ...getValues(),
        contract: contractUrl
      });
    }
  }, [contractUrl, getValues, reset]);

  if (isSuccess) {
    toast.success('Room reserved successfully', {
      onClose: () => {
        navigate(`/dashboard/hotels/${id}/rental-room-reservations`);
      },
      toastId: 'create-rental-room-reservation',
      position: 'top-center'
    });
  }

  const setContract = (file) => {
    setContractUrl(file);
  };

  if (resident) setValue('ResidentId', resident.id);

  return (
    <PageWrapper title={'New Rental Reservtion'}>
      <Grid
        container
        spacing={4}
        sx={{
          py: 4
          // paddingBottom: 8,
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Paper
            elervetion={5}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography component="h3" variant="h5" sx={{ textTransform: 'uppercase' }}>
              Resident Information
            </Typography>

            <TextField
              placeholder="Search Resident"
              fullwidth
              onChange={(e) => handleSearchResident(e.target.value)}
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
            {searchedResidents && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 2,
                  // show scroll only if the content is greater than the height
                  overflowY: searchedResidents.length > 5 ? 'scroll' : 'hidden',
                  maxHeight: '450px'
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
                  (Search Result) Residents List
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
                    {searchedResidents.map((resident) => (
                      <ListItem
                        key={resident.id}
                        disablePadding
                        onClick={() => {
                          setResident(resident);
                        }}
                      >
                        <ListItemButton>
                          <ListItemText primary={`${resident.firstName} ${resident.lastName}`} secondary={resident.phone} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            )}

            {resident && (
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
                  {resident.firstName} {resident.lastName}
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
                  {resident.phone}
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
                  {resident.email}
                </Typography>
              </Box>
            )}
            {!searchedResidents && search.length > 0 && (
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
                  There is no resident with this information: {search}
                  <em style={{ display: 'block' }}> Please fill the form below to create a new resident</em>
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Paper
            elervetion={5}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
              mb: 3
            }}
          >
            <Typography component="h3" variant="h5" sx={{ textTransform: 'uppercase', mb: 1 }}>
              Reservation
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl required sx={{ width: '100%' }}>
                  <Controller
                    {...register('dateIn')}
                    required
                    control={control}
                    defaultValue={dayjs().format('YYYY-MM-DD')}
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
                <FormControl fullWidth>
                  <InputLabel id="paymentMethod-select">Payment Method</InputLabel>
                  <Select
                    {...register('paymentMethod')}
                    labelId="paymentMethod-select"
                    placeholder="Select payment Method"
                    defaultValue=""
                    error={!!errors.paymentMethod}
                    helpertext={errors?.paymentMethod?.message}
                    label="Payment Method"
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="paidAmount"
                  label="Paid Amount"
                  {...register('paidAmount')}
                  type="number"
                  error={!!errors.paidAmount}
                  helpertext={errors?.paidAmount?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="deposit"
                  label="Deposit"
                  {...register('deposit')}
                  type="number"
                  error={!!errors.deposit}
                  helpertext={errors?.deposit?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="contractPeriod"
                  label="Contract Period"
                  {...register('contractPeriod')}
                  type="number"
                  error={!!errors.contractPeriod}
                  helpertext={errors?.contractPeriod?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="activePeriod"
                  label="Active Period"
                  {...register('activePeriod')}
                  type="number"
                  error={!!errors.activePeriod}
                  helpertext={errors?.activePeriod?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="room-select">Room</InputLabel>
                  <Select
                    labelId="room-select"
                    placeholder="Select Room"
                    {...register('roomId')}
                    defaultValue=""
                    error={!!errors.roomId}
                    helpertext={errors?.roomId?.message}
                    label="Room"
                  >
                    {data?.data?.availableRentalRooms?.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.roomNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FileUploadComponent setFile={setContract} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <LoadingButton
                type="submit"
                endIcon={<Save />}
                loading={isLoading}
                loadingPosition="end"
                variant="contained"
                sx={{
                  fontSize: 16,
                  my: 4,
                  width: {
                    lg: '20%'
                  },
                  [theme.breakpoints.down('md')]: {
                    width: '100%',
                    fontSize: 10
                  }
                }}
              >
                Create Reservation
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
