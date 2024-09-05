import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useFetchExpenseQuery } from './expensesApiSlice';
import Loading from 'components/Loading';
import PhotoViewer from 'components/PhotoView';
import dayjs from 'dayjs';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import { currency } from 'store/constant';

const ExpenseDetails = () => {
  const { expenseId } = useParams();
  const { data, isLoading } = useFetchExpenseQuery(expenseId);
  if (isLoading) <Loading />;

  return (
    <PageWrapper title={data?.type === 'default' ? 'Expense Details' : 'Drawing Details'}>
      <Paper elevation={5} sx={{ padding: 2, maxWidth: '100%' }}>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Amount:{currency} {data?.amount}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Reason: {data?.reason}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          By whom: {data?.byWhom}
        </Typography>

        {data?.type === 'default' && (
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Receipt Number: {data?.receiptNumber}
          </Typography>
        )}

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Date:{dayjs.tz(dayjs(data?.date)).format('YYYY-MM-DD HH:mm:ss')}
        </Typography>
      </Paper>
      <Paper elevation={5} sx={{ mt: 3, padding: 2, maxWidth: '100%' }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Receipts
        </Typography>
        <PhotoViewer images={data?.receipts ? data?.receipts : []} />
      </Paper>
    </PageWrapper>
  );
};

export default ExpenseDetails;
