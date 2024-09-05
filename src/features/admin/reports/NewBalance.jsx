import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Paper, Box, Container } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Save } from '@mui/icons-material';
import { useCreateBalanceMutation } from './reportsApiSlice';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export default function NewBalance() {
  const navigate = useNavigate();

  const [monthYear, setMonthYear] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    day: new Date().getDate()
  });
  const [createBalance, { isLoading, isSuccess, errors, isError }] = useCreateBalanceMutation();

  const handleSubmit = async () => {
    try {
      await createBalance({ data: monthYear }).unwrap();
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (isError) {
    toast.error(errors.message);
  }

  if (isSuccess) {
    toast.success('Balance Generated Successfully!', {
      onClose: () => {
        navigate('/dashboard/balances');
      },
      toastId: 'add-expense',
      position: 'top-center'
    });
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ display: 'inline-block' }}>
              <DatePicker
                openTo="month"
                label="Month and Year"
                value={dayjs(`${monthYear.year}-${monthYear.month}-${monthYear.day}`)}
                onChange={(date) => {
                  setMonthYear({
                    month: dayjs(date).month() + 1,
                    year: dayjs(date).year(),
                    day: dayjs(date).date()
                  });
                }}
                views={['month', 'year']}
                slotProps={{ textField: { variant: 'outlined' } }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ marginBottom: 2 }}>
            <LoadingButton type="submit" fullWidth variant="contained" loading={isLoading} loadingPosition="start" startIcon={<Save />}>
              Save
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
