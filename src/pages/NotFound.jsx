//Not Found page
import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: '100%',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: '10rem',
          color: 'red',
          letterSpacing: 3,
          textTransform: 'uppercase'
        }}
      >
        404
      </Typography>
      <Typography variant="h4">Page Not Found</Typography>
      <Button variant="outlined" color="info" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </Box>
  );
};

export default NotFound;
