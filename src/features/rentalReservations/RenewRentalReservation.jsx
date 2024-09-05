import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { Close } from '@mui/icons-material';
import { useRenewRentalRoomReservationMutation } from '../admin/hotels/rentalRoomReservations/rentalRoomReservationsApiSlice';

const schema = Yup.object().shape({
  paidAmount: Yup.number().required('Paid Amount is required'),
  paymentMethod: Yup.string().oneOf(['cash', 'card']).required('Paid by is required'),
  renewalPeriod: Yup.number().min(1).max(11).required('Renewal Period is required')
});

const RenewRentalReservation = ({ onClose, open, reservation }) => {
  const theme = useTheme();
  const [renewRentalRoomReservation, { isSuccess, isLoading }] = useRenewRentalRoomReservationMutation();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [totalAmount, setTotalAmount] = useState(0);

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
    await renewRentalRoomReservation({
      id: reservation.id,
      data
    });
    if (isSuccess)
      toast.success('Reservation renewed successfully', {
        position: toast.POSITION.TOP_RIGHT,
        toastId: 'rental-renewal'
      });

    onClose();
    reset();
  };

  useEffect(() => {
    setTotalAmount(watch('renewalPeriod') * reservation.RentalRoom.rentAmount);
    if (watch('paidAmount') > totalAmount + reservation.unpaidAmount) reset({ paidAmount: totalAmount + reservation.unpaidAmount });
    if (watch('paidAmount') < 0) reset({ paidAmount: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('renewalPeriod'), watch('paidAmount')]);

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={onClose} aria-labelledby="dialog-title" fullWidth>
        <DialogTitle id="dialog-title">Renew Rental Reservation</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'monospace', mb: 2 }}>
              <Typography
                sx={{
                  color: 'text.secondary',
                  mr: 2
                }}
              >
                <pre>Total-Amount = Months * Rent-Price</pre>
              </Typography>
              <pre>Total={totalAmount}</pre>
              <>
                {reservation.unpaidAmount > 0 && (
                  <Typography variant="subtitle">Total Amount with unpaidAmount={totalAmount + reservation.unpaidAmount}</Typography>
                )}
              </>
            </Typography>
            <Divider />
            <Box sx={{ my: 3 }} />
            <Stack spacing={2} sx={{ mb: 4 }}>
              <TextField
                label="Months to renew"
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 12 } }}
                {...register('renewalPeriod')}
                error={!!errors.renewalPeriod}
                helperText={errors?.renewalPeriod?.message}
              />
              <TextField
                label="Paid Amount"
                variant="outlined"
                type="number"
                {...register('paidAmount')}
                error={!!errors.totalAmount}
                helperText={errors?.totalAmount?.message}
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
                Renew
              </LoadingButton>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RenewRentalReservation;
