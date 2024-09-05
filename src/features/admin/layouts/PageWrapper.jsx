import React from 'react';
import BackButton from 'components/BackButton';
import { Divider, Typography } from '@mui/material';
import { Box, useTheme } from '@mui/system';

const PageWrapper = ({ children, title }) => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 4,
          [theme.breakpoints.down('sm')]: {
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            pl: 1
          }
        }}
      >
        <BackButton
          variant="outlined"
          size="medium"
          sx={{
            [theme.breakpoints.down('sm')]: {
              display: 'none'
            }
          }}
        />

        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            flex: 5,
            alignSelf: 'center',
            textTransform: 'uppercase',
            letterSpacing: 1,
            [theme.breakpoints.down('up')]: {
              letterHeight: 1.3
            },

            [theme.breakpoints.down('sm')]: {
              flex: 1,
              alignSelf: 'flex-end',
              letterHeight: 1
            }
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            flex: 1,
            [theme.breakpoints.down('sm')]: {
              display: 'none'
            }
          }}
        />
      </Box>
      <Divider sx={{ width: '100%', height: '1px', mb: 1, backgroundColor: '#cacaca' }} />

      <Box
        sx={{
          width: '95%',
          height: '90vh',
          px: 'auto',
          mx: 'auto',
          // mt: 3,
          pt: {
            lg: 2,
            md: 2
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageWrapper;
