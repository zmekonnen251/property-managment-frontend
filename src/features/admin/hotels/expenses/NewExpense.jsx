import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Paper, TextField, Box, Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { useCreateHotelExpenseMutation } from './expensesApiSlice';
import Dropzone from 'components/Dropzone';
import PageWrapper from 'features/admin/layouts/PageWrapper';

export default function NewExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [receipts, setReceipts] = React.useState([]);
  const type = location.state.type;

  const [createHotelExpense, { isLoading, isSuccess }] = useCreateHotelExpenseMutation();
  const schema = yup.object().shape({
    amount: yup.number().required('Amount is required'),
    date: yup.string().required('Date is required'),
    reason: yup.string().required('Reason is required'),
    byWhom: yup.string().required('By whom is required'),
    receiptNumber: yup.string()
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    if (receipts.length > 0) {
      data.receipts = receipts;
    }
    data.type = type;
    await createHotelExpense({ data, id });
  };

  if (isSuccess) {
    toast.success(`${type === 'default' ? 'Expense' : 'Drawing'} created successfully`, {
      onClose: () => {
        navigate(`/dashboard/hotels/${id}/${type === 'default' ? 'expenses' : 'drawings'}`);
      },
      toastId: 'add-expense',
      position: 'top-center'
    });
  }

  return (
    <PageWrapper title={type === 'default' ? 'New Expense' : 'New Drawing'}>
      <Paper elevation={3} sx={{ padding: 2, mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                {...register('amount')}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      timezone="Africa/Johannesburg"
                      label="Date"
                      sx={{ width: '100%' }}
                      renderInput={(props) => <TextField {...props} />}
                      {...field}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Reason" {...register('reason')} error={!!errors.reason} helperText={errors.reason?.message} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="By Whom" {...register('byWhom')} error={!!errors.byWhom} helperText={errors.byWhom?.message} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Receipt Number"
                {...register('receiptNumber')}
                error={!!errors.receiptNumber}
                helperText={errors.receiptNumber?.message}
              />
            </Grid>
          </Grid>
          <Box sx={{ marginBottom: 2 }}>
            <Dropzone title="Upload Expense Receipts" setImageUrls={setReceipts} />
          </Box>
          <Box sx={{ my: 2, width: '30%' }}>
            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<Save />}
              sx={{ fontSize: 16, padding: 1, borderRadius: 2 }}
            >
              {type === 'default' ? 'Add Expense' : 'Add Drawing'}
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </PageWrapper>
  );
}
