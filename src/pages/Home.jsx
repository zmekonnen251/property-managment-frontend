import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <Container
    maxWidth="lg"
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}
  >
    {/* a welcome message */}
    <Typography variant="h3" sx={{ mb: 2 }}>
      Welcome to Hotel Management System
    </Typography>
    <Box>
      <img
        src="https://images.unsplash.com/photo-1611176843650-5b7e9d495a9a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjB3b3JsZHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
        alt=""
      />

      {/* a link to hotels */}
      <Link to="/hotels">
        <Button variant="contained" color="primary">
          Hotels
        </Button>
      </Link>
    </Box>
  </Container>
);

export default Home;
