import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import { useGetEmployeeQuery } from './employeesApiSlice';
import Loading from 'components/Loading';
import PageWrapper from '../layouts/PageWrapper';

const EmployeeDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetEmployeeQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageWrapper title={`Employee ${data?.firstName} ${data?.lastName} Details`}>
      {isSuccess && (
        <Paper elevation={5} sx={{ padding: 2, maxWidth: '70%' }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Name: {data?.firstName} {data?.lastName}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Hired Date: {new Date(data.hiredAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Salary: {data?.salary}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Role: {data?.role}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            phone: {data?.phone}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            email: {data?.email}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Date Of Birth: {new Date(data?.dateOfBirth).toLocaleDateString()}
          </Typography>
        </Paper>
      )}
    </PageWrapper>
  );
};

export default EmployeeDetails;
