import React from 'react';
import { Box } from '@mui/material';
import PulseLoader from 'react-spinners/PulseLoader';

const Loading = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <PulseLoader color="#319c41" size={15} />
  </Box>
);

export default Loading;
