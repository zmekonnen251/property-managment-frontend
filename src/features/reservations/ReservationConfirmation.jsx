import React from 'react';

import dayjs from 'dayjs';
import { currency } from 'store/constant';
import { Paper, styled, Typography, Grid, Box } from '@mui/material';

// const StyledDiv = styled('div')(() => ({
//   width: '100%',
//   minHeight: '100vh',
//   display: 'flex',
//   flexDirection:'column',
//   justifyContent: 'center',
//   alignItems: 'center',
//   background: '#f5f5f5'
// }));

// const StyledPaper = styled(Paper)(() => ({
//   padding: '12px',
//   maxWidth: '900px',
//   width: '100%',
//   boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
//   backgroundColor: '#fff',
//   borderRadius: '8px'
// }));

const StyledHeading = styled(Typography)(() => ({
  marginBottom: '8px',
  color: '#2e7d32'
}));

const StyledFooter = styled('footer')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '1px solid #ccc',
  paddingTop: '8px',
  marginTop: '8px'
}));

const StyledFooterText = styled(Typography)(() => ({
  color: '#2e7d32',
  fontWeight: 'bold'
}));

const StyledContentText = styled(Typography)(() => ({
  color: '#555',
  marginBottom: '8px'
}));

// const classes = {
//   root: {
//     width: '100%',
//     minHeight: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     background: '#f5f5f5'
//   },
//   paper: {
//     padding: '12px',
//     maxWidth: '900px',
//     width: '100%',
//     boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
//     borderRadius: '8px',
//   },
//   heading: {
//     marginBottom: '8px',
//     color: '#2e7d32'
//   },
//   content: {
//     marginBottom: '16px'
//   },
//   contentText: {
//     color: '#555',
//     marginBottom: '8px'
//   },
//   footer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     borderTop: '1px solid #ccc',
//     paddingTop: '8px',
//     marginTop: '8px'
//   },
//   footerText: {
//     color: '#2e7d32',
//     fontWeight: 'bold'
//   }
// };

const StyledOl = styled('ol')(() => ({
  paddingLeft: '16px',
  marginBottom: '16px'
}));

const StyledNoteSection = styled('div')(() => ({
  marginBottom: '16px'
}));

class ReservationConfirmation extends React.Component {
  render() {
    const { Guest, Employee, Hotel, dateIn, dateOut, reservationDays, Rooms, createdAt } = this.props.reservation;

    return (
      <div
        style={{
          background: '#f5f5f5',
          boxSizing: 'border-box',
          width: '100vw',
          height: '100'
        }}
      >
        <Paper
          sx={{
            px: 8,
            py: 2,
            width: '100%',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            color: '#222'
          }}
        >
          <StyledHeading variant="h2">Reservation Confirmation</StyledHeading>
          <Grid container sx={{ mb: 12 }} spacing={2}>
            <Grid item xs={12} md={6}>
              <StyledContentText>
                Property:
                {Hotel.name}
              </StyledContentText>
              <StyledContentText>
                Phone:
                {Hotel.phone}
              </StyledContentText>
              <StyledContentText>
                Address:
                {Hotel.address}
              </StyledContentText>
              <Typography variant="body1">Check-in: {dayjs.tz(dayjs(dateIn)).format('DD/MM/YYYY HH:mm')}</Typography>
              <Typography variant="body1">Check-out: {dayjs.tz(dayjs(dateOut)).format('DD/MM/YYYY HH:mm')}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Guest Name: {Guest.firstName} {Guest.lastName}
              </Typography>
              <Typography variant="body1">Guest Email: {Guest.email}</Typography>
              <Typography variant="body1">Guest Phone Number: {Guest.phone}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">
                Created By: {Employee.firstName} {Employee.lastName}
              </Typography>
              <Typography variant="body1">Created At: {dayjs.tz(dayjs(createdAt)).format('DD/MM/YYYY HH:mm')}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Reservation Days: {reservationDays}</Typography>
              {/* Add other reservation details as needed */}
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledContentText variant="h6">Rooms:</StyledContentText>
              {Rooms.map((room) => (
                <Box key={room.id}>
                  <StyledContentText variant="body1">Room Type: {room?.RoomType?.name}</StyledContentText>
                  <StyledContentText variant="body1">
                    Room Number: {room?.roomNumber}- {currency}
                    {room?.RoomType?.currentPrice} per night
                  </StyledContentText>
                  <StyledContentText variant="body1">Capcity: {room?.RoomType?.capacity}</StyledContentText>
                  <StyledContentText variant="body1">Property: {room?.RoomType?.Hotel?.name}</StyledContentText>
                </Box>
              ))}

              {/* Add other reservation details as needed */}
            </Grid>
          </Grid>
          <StyledFooter>
            <StyledFooterText>
              Total Price:
              {currency} {this.props?.reservation?.paidAmount}
            </StyledFooterText>
          </StyledFooter>
        </Paper>

        <Paper
          sx={{
            px: 8,

            width: '100%',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            color: '#222'
          }}
        >
          <StyledHeading variant="h5">
            <strong>RULES</strong>
          </StyledHeading>

          <StyledOl>
            <li>No mirachat is allowed to be consumed on these premises.</li>
            <li>No smoking allowed inside rooms.</li>
            <li>No noise allowed.</li>
            <li>No room keys are to leave the premises.</li>
            <li>Keys are to be left at reception and collected from reception at all times.</li>
            <li>Bookings to commit fomication will not be allowed.</li>
            <li>
              Any person who damages any valuable property of Bilal Guest House will be penalized the full cost of such damage. Any line
              caught causing minor vandalism on the premises shall be fined a lump sum of R1500.
            </li>
            <li>Payment should be made upon booking.</li>
            <li>Bilal Guest House shall not be responsible for any lost or damaged property of valued customers.</li>
            <li>Visitation time will be allowed until 10pm.</li>
            <li>Booking will commence from 12pm.</li>

            <li>CHECK OUT TIME IS STRICTLY BETWEEN 10AM-11AM.</li>
          </StyledOl>

          <StyledNoteSection>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              <strong>PLEASE NOTE:</strong>
            </Typography>
            <Typography variant="body1">
              If you cancel your booking, you will be charged a 50% cancellation fee (provided you have not occupied the room). If you
              cancel your booking after occupying the room, you will be charged a 100% cancellation fee (no refund).
              <br />
              <br />
              <strong style={{ display: 'inline-block', textAlign: 'center' }}>FADLAN OGOW:</strong>
              <br />
              Haddii aad joojiso ballansashada hoteelkaaga, waxaa lagugu soo dalacayaa 50% khidmad baabi&rsquo;in ah. HADDII AAD BAajiso
              buugaaggii aad dhigatay ka dib marka aad qolka gasho waxa lagugu soo dalacayaa 100% khidmad joojin (MA soo celin lacag).
              <br />
              <br />
              <strong style={{ display: 'inline-block', textAlign: 'center' }}>ማስታወሻ ያዝ:</strong>
              <br />
              ቦታ ማስያዝዎን ከሰረዙ፣ 50% የስረዛ ክፍያ እንዲከፍሉ ይደረጋሉ። በክፍሉ ውስጥ ለጥቂት ደቂቃዎች ከቆዩ በኋላ ያስያዙት ቦታ ከሰረዙ፣ 100% የስረዛ ክፍያ እንዲከፍሉ ይደረጋሉ (ተመላሽ ገንዘብ
              የለም).
            </Typography>
          </StyledNoteSection>

          <StyledContentText>Thank you.</StyledContentText>
          <StyledContentText>By Manegment</StyledContentText>
        </Paper>

      </div>
    );
  }
}

export default ReservationConfirmation;
