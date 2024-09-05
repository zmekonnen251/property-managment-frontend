import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { Close } from '@mui/icons-material';
import { useUpdateUnpaidRentalRoomReservationMutation } from '../admin/hotels/rentalRoomReservations/rentalRoomReservationsApiSlice';

const schema = Yup.object().shape({
  paidAmount: Yup.number().min(0, 'Paid Amount has to be greater than 0!').required('Paid Amount is required'),
  paymentMethod: Yup.string().oneOf(['cash', 'card']).required('Paid by is required')
});

const UpdatePayment = ({ onClose, open, reservation }) => {
  const theme = useTheme();
  const [updateUnpaidRentalRoomReservation, { isSuccess, isLoading }] = useUpdateUnpaidRentalRoomReservationMutation();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    await updateUnpaidRentalRoomReservation({
      id: reservation.id,
      data: {
        paidAmount: data.paidAmount,
        paymentMethod: data.paymentMethod
      }
    });

    if (isSuccess)
      toast.success('Payment updated successfully', {
        position: toast.POSITION.TOP_RIGHT,
        toastId: 'rental-payment-update'
      });

    if (isSuccess) reset();

    onClose();
  };

  useEffect(() => {
    if (watch('paidAmount') > reservation.unpaidAmount) reset({ paidAmount: reservation.unpaidAmount });
    if (watch('paidAmount') < 0) reset({ paidAmount: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('paidAmount')]);

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={onClose} aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title" sx={{ textAlign: 'center' }}>
          Renew Rental Reservation
        </DialogTitle>
        <Box sx={{ my: '1.5px' }} />
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} sx={{ mb: 4 }}>
              <TextField
                label="Paid Amount"
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                {...register('paidAmount')}
                error={!!errors.paidAmount}
                helperText={errors?.paidAmount?.message}
              />
              <FormControl variant="outlined">
                <InputLabel id="paymentMethod">Payment Method</InputLabel>
                <Select
                  labelId="paymentMethod"
                  id="paymentMethod"
                  label="Payment Method"
                  {...register('paymentMethod')}
                  error={!!errors.paymentMethod}
                  helperText={errors?.paymentMethod?.message}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Card</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <DialogActions>
              <Button onClick={onClose} sx={{ bgcolor: 'red' }} variant="contained" endIcon={<Close />}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isLoading} loadingPosition="end" disabled={isLoading}>
                Update Payment
              </LoadingButton>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdatePayment;
