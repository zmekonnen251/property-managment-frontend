import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import dayjs from 'dayjs';
import { currency } from 'store/constant';
import useAuth from 'hooks/useAuth';

const classes = {
  root: {
    width: '400px',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    background: '#f5f5f5'
  },
  paper: {
    // paddingTop: '20px',
    padding: '22px',
    maxWidth: '900px',
    height: '95vh',
    width: '100%',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    background: '#f5f5f5',
    color: '#222'
  },
  heading: {
    marginBottom: '8px',
    color: '#2e7d32'
  },
  content: {
    marginBottom: '16px'
  },
  contentText: {
    color: '#555',
    marginBottom: '8px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #ccc',
    paddingTop: '8px',
    marginTop: '8px'
  },
  footerText: {
    color: '#2e7d32',
    fontWeight: 'bold'
  }
};

const PaymentConfirmation = React.forwardRef(({ lastPaid }, ref) => {
  const user = useAuth();
  const [lastPayment, setLastPayment] = useState({
    resident: {},
    propertyName: '',
    roomNumber: '',
    employee: '',
    reason: '',
    date: '',
    paidAmount: '',
    propertyAddress: '',
    propertyPhone: ''
  });

  const { resident, propertyName, roomNumber, employee, reason, date, paidAmount, propertyAddress, propertyPhone } = lastPayment;

  useEffect(() => {
    setLastPayment((prev) => ({
      ...prev,
      resident: lastPaid?.Resident,
      propertyName: lastPaid?.Hotel?.name,
      propertyAddress: lastPaid?.Hotel?.address,
      propertyPhone: lastPaid?.Hotel?.phone,
      roomNumber: lastPaid?.RentalRoomReservation.RentalRoom.room,
      employee: `${user?.firstName} ${user?.lastName}`,
      reason: lastPaid?.message,
      date: dayjs.tz(dayjs(lastPaid?.paymentDate)).format('DD/MM/YYYY HH:mm'),
      paidAmount: lastPaid?.totalAmount
    }));
  }, [lastPaid, user?.firstName, user?.lastName]);

  return (
    <div ref={ref} style={classes.root}>
      <Paper style={classes.paper} sx={{ pl: 3 }}>
        <Typography variant="h4" style={classes.heading}>
          Payment Confirmation for {reason}
        </Typography>
        <Grid container style={classes.content} spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography style={classes.contentText} variant="h6">
              Property:
              {propertyName}
            </Typography>
            <Typography style={classes.contentText} variant="h6">
              Address:
              {propertyAddress}
            </Typography>
            <Typography style={classes.contentText} variant="h6">
              Phone Number:
              {propertyPhone}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" style={classes.contentText}>
              Payment Reason:
              {reason}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">Resident Name: {`${resident?.firstName} ${resident?.lastName}`}</Typography>
            <Typography variant="body1">Guest Email: {resident?.email}</Typography>
            <Typography variant="body1">Guest Phone Number: {resident?.phone}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">Created By: {employee}</Typography>
            <Typography variant="body1">Payment date:{date}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="body1">Room Number: {roomNumber}</Typography>
            </Box>

            {/* Add other reservation details as needed */}
          </Grid>
        </Grid>
        <div style={classes.footer}>
          <span>
            Paid Amount:
            {currency} {paidAmount}
          </span>
        </div>
      </Paper>
    </div>
  );
});

export default PaymentConfirmation;
