import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import dayjs from 'dayjs';
import { currency } from 'store/constant';

const classes = {
  root: {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    background: '#f5f5f5'
  },
  paper: {
    paddingTop: '20px',
    padding: '12px',
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

class ReservationConfirmation extends React.Component {
  render() {
    const {
      dateIn,
      dateOut,
      contractPeriod,
      Resident,
      deposit,
      Hotel: { name: hotelName, address, phone }
    } = this.props.reservation;

    return (
      <div style={classes.root}>
        <Paper style={classes.paper}>
          <Typography variant="h4" style={classes.heading}>
            Reservation Confirmation
          </Typography>
          <Grid container style={classes.content} spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" style={classes.contentText}>
                Property Details
              </Typography>
              <Typography variant="h6" style={classes.contentText}>
                Property:
                {hotelName}
              </Typography>
              <Typography variant="body1">Phone: {phone}</Typography>
              <Typography variant="body1">Address: {address}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Check-in: {dayjs.tz(dayjs(dateIn)).format('YYYY-MM-DD HH:mm')}</Typography>
              <Typography variant="body1">Active Until: {dayjs.tz(dayjs(dateOut)).format('YYYY-MM-DD HH:mm')}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Resident Name: {Resident.firstName} {Resident.lastName}
              </Typography>
              <Typography variant="body1">Resident Email: {Resident.email}</Typography>
              <Typography variant="body1">Resident Phone Number: {Resident.phone}</Typography>
              <Typography variant="body1">Deposit: {deposit}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Created At: {dayjs.tz(dayjs(this.props.reservation.createdAt)).format('YYYY-MM-DD')}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" style={classes.contentText}>
                Room
              </Typography>

              <Box>
                <Typography variant="body1">
                  Room Number: <strong>{this.props.reservation.RentalRoom.roomNumber}</strong>
                </Typography>
                <Typography variant="body1">
                  Rent Amount: <strong>{this.props.reservation.RentalRoom.rentAmount}</strong>
                </Typography>
              </Box>
              {/* Add other reservation details as needed */}
            </Grid>
          </Grid>
          <div style={classes.footer}>
            <span>
              Total Price: {currency} {this.props.reservation.activePeriod * this.props.reservation.RentalRoom.rentAmount}
            </span>
            <span>Contract Period: {contractPeriod} months</span>
            Unpaid Amount: {currency} {this.props.reservation.unpaidAmount}
          </div>
        </Paper>
      </div>
    );
  }
}

export default ReservationConfirmation;
