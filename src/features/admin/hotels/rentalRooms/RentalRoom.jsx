import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Box, Button, Paper, Typography } from '@mui/material';

import Loading from 'components/Loading';
import { useGetRentalRoomQuery } from './rentalRoomsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';

const RentalRoomDetails = () => {
  const { id, rentalRoomId } = useParams();
  const { data, isLoading } = useGetRentalRoomQuery(rentalRoomId);

  if (isLoading) <Loading />;

  return (
    <PageWrapper title={`Rental Room ${data?.roomNumber} Details`}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3, gap: 3 }}>
        {/* Back to previous page button */}

        <Link to={`/dashboard/hotels/${id}/rental-rooms/${rentalRoomId}/edit`}>
          <Button variant="outlined">Edit</Button>
        </Link>
      </Box>

      <Paper elevation={5} sx={{ padding: 2, maxWidth: '70%' }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Lease Unit Number: {data?.roomNumber}
        </Typography>

        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Status: {data?.status}
        </Typography>

        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Hotel: {data?.Hotel?.name}
        </Typography>

        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Rent Price: {data?.rentAmount}
        </Typography>

        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Updated At: {new Date(data?.updatedAt).toLocaleDateString()}
        </Typography>
      </Paper>
    </PageWrapper>
  );
};

export default RentalRoomDetails;
