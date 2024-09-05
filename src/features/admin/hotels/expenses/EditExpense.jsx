// Edit expense page
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Alert, Box, Button, IconButton, ImageList, ImageListItem, ImageListItemBar, Paper, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useFetchExpenseQuery, useUpdateExpenseMutation } from './expensesApiSlice';
import Loading from 'components/Loading';
import { Delete } from '@mui/icons-material';
import Dropzone from 'components/Dropzone';
import { toast } from 'react-toastify';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const schema = yup.object().shape({
  amount: yup.number().required('Amount is required'),
  date: yup.string().required('Date is required'),
  reason: yup.string().required('Reason is required'),
  byWhom: yup.string().required('By whom is required'),
  receiptNumber: yup.string()
});

const EditExpense = () => {
  const location = useLocation();
  const type = location.state.type;
  const { expenseId, id } = useParams();
  const navigate = useNavigate();
  const [updateExpense, { isSuccess, isLoading }] = useUpdateExpenseMutation();

  const [files, setFiles] = React.useState([]); // [
  const [newReceipts, setNewReceipts] = React.useState([]);
  const { data: expenseData, isSuccess: isFetchExpenseSuccess } = useFetchExpenseQuery(expenseId);

  const removeFile = (f) => {
    setFiles((files) => files.filter((file) => file !== f));
  };

  const removeAll = () => {
    setFiles([]);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: 0,
      date: dayjs.tz(),
      reason: '',
      byWhom: '',
      receiptNumber: ''
    }
  });
  React.useEffect(() => {
    if (isFetchExpenseSuccess) {
      setFiles(expenseData.receipts);
      reset({
        amount: expenseData.amount,
        date: dayjs.tz(dayjs(expenseData.date)),
        reason: expenseData.reason,
        byWhom: expenseData.byWhom,
        receiptNumber: expenseData.receiptNumber
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchExpenseSuccess]);

  const onSubmit = async (data) => {
    if (newReceipts.length > 0) {
      data.receipts = [...newReceipts, ...files];
    } else {
      data.receipts = files;
    }

    data.type = type;

    // try {
    await updateExpense({ id: expenseId, data });
  };

  if (isSuccess) {
    navigate(`/dashboard/hotels/${id}/${type === 'default' ? 'expenses' : 'drawings'}/${expenseId}`);
    toast.success(`${type === 'default' ? 'Expense' : 'Drawing'} updated successfully`, {
      toastId: 'expense-update-success',
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000
    });
  }

  return (
    <PageWrapper title={`Edit ${type === 'default' ? 'Expense' : 'Drawing'}`}>
      <Paper elevation={3} sx={{ padding: 2, maxWidth: '700px', mx: 'auto' }}>
        {isLoading && <Loading />}
        {isSuccess && <Alert severity="success">Expense updated successfully</Alert>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('amount')}
            error={!!errors.amount}
            helperText={errors?.amount?.message}
            type="number"
          />
          <TextField
            label="Reason"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('reason')}
            error={!!errors.reason}
            helperText={errors?.reason?.message}
          />
          <TextField
            label="By whom"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('byWhom')}
            error={!!errors.byWhom}
            helperText={errors?.byWhom?.message}
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  timezone="Africa/Johannesburg"
                  value={dayjs(field.value)}
                  onChange={(e) => field.onChange(e)}
                  renderInput={(params) => (
                    <TextField {...params} margin="normal" error={!!errors.date} helperText={errors?.date?.message} />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <TextField
            label="Receipt Number"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register('receiptNumber')}
            error={!!errors.receiptNumber}
            helperText={errors?.receiptNumber?.message}
          />
          <Box sx={{ marginTop: 2 }}>
            {files && files.length > 0 && (
              <ImageList cols={2} rowHeight={164}>
                {files.map((file) => (
                  <ImageListItem key={file}>
                    <img src={file} alt={file} loading="lazy" style={{ width: '100%', height: '100%' }} />
                    <ImageListItemBar
                      title={file}
                      actionIcon={
                        <IconButton sx={{ color: 'white' }} onClick={() => removeFile(file)}>
                          <Delete />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
                {/* Action button to remove all files */}
                {files.length > 0 && (
                  <ImageListItem component={Button} onClick={removeAll}>
                    <img
                      src="https://via.placeholder.com/300x300?text=Remove+All"
                      alt="Remove All"
                      loading="lazy"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <ImageListItemBar
                      title="Remove All"
                      actionIcon={
                        <IconButton sx={{ color: 'white' }} onClick={removeAll}>
                          <Delete color="warning" />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                )}
              </ImageList>
            )}
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Dropzone title="Upload New Receipts" setImageUrls={setNewReceipts} />
          </Box>
          <Box sx={{ my: 2 }}>
            <Button variant="contained" type="submit">
              Update
            </Button>
          </Box>
        </form>
      </Paper>
    </PageWrapper>
  );
};

export default EditExpense;
