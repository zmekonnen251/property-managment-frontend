import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, Divider, Button, Paper, Tooltip } from '@mui/material';
import dayjs from 'dayjs';
import { EmailSharp, Print } from '@mui/icons-material';
import { useGetRentalRoomReservationQuery, useSendRentalRoomReservationConfirmationEmailMutation } from './rentalRoomReservationsApiSlice';
import ReactToPrint from 'react-to-print';
import ReservationConfirmation from './ReservationConfirmation';
import DocReaderModal from 'components/DocReaderModal';

import Loading from 'components/Loading';
import LoadingButton from '@mui/lab/LoadingButton';
import useAuth from 'hooks/useAuth';
import { toast } from 'react-toastify';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import { currency } from 'store/constant';

const RentalRoomReservationDetails = () => {
  const { id, reservationId } = useParams();
  const user = useAuth();
  const [openViewer, setOpenViewer] = React.useState(false);
  const [fileURL, setFileURL] = React.useState('');

  const { data, isFetching } = useGetRentalRoomReservationQuery(reservationId);
  const [sendReservationConfirmationEmail, { isLoading: isSendEmailLoading, isSuccess: isSendEmailSuccess }] =
    useSendRentalRoomReservationConfirmationEmailMutation();

  const componentToPrintRef = useRef();

  const handlePdfView = (url) => {
    setFileURL(url);
    setOpenViewer(true);
  };

  if (isFetching) {
    return <Loading />;
  }

  if (isSendEmailSuccess) {
    toast.success('Email sent successfully', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      toastId: 'confirmation-email'
    });
  }
  return (
    <PageWrapper title="Rental Room Reservation Details">
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box sx={{ my: 2 }}>
          <Link to={`/dashboard/hotels/${id}/rental-room-reservations/${reservationId}/receipts`}>
            <Button variant="outlined">Receipts</Button>
          </Link>
        </Box>

        <Box sx={{ my: 2 }}>
          <ReactToPrint
            trigger={() => (
              <Button variant="outlined" endIcon={<Print />}>
                Print
              </Button>
            )}
            content={() => componentToPrintRef.current}
          />
          <Box sx={{ display: 'none' }}>
            <ReservationConfirmation ref={componentToPrintRef} reservation={data} user={user} />
          </Box>
        </Box>
        <Box sx={{ my: 2 }}>
          <LoadingButton
            loading={isSendEmailLoading}
            endIcon={<EmailSharp />}
            variant="outlined"
            onClick={async () => {
              await sendReservationConfirmationEmail(reservationId);
            }}
          >
            Send Email
          </LoadingButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          direction="column"
          spacing={2}
          sx={{
            p: 0.5,
            display: 'flex',
            flexDirection: 'column',
            width: '50%'
          }}
        >
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Date In:{' '}
            </Typography>
            {dayjs(data?.dateIn).format('DD/MM/YYYY')}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Active Until:{' '}
            </Typography>
            {dayjs(data?.dateOut).format('DD/MM/YYYY')}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Paid Amount:{' '}
            </Typography>
            {currency} {data?.RentalReservationReceipts?.at(-1)?.totalAmount}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Deposit:{' '}
            </Typography>
            {currency}
            {data?.deposit}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Unpaid Amount:{' '}
            </Typography>
            {currency}
            {data?.unpaidAmount}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Paid By:{' '}
            </Typography>
            {data?.RentalReservationReceipts?.at(-1)?.paymentMethod}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h2" sx={{ fontSize: '1.6rem' }}>
            Resident Details
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              First Name:{' '}
            </Typography>
            {data?.Resident?.firstName}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Last Name:{' '}
            </Typography>
            {data?.Resident?.lastName}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              ID Number:{' '}
            </Typography>
            {data?.Resident?.idNumber}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Id Type:{' '}
            </Typography>
            {data?.Resident?.idType}
          </Typography>

          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Phone:{' '}
            </Typography>
            {data?.Resident?.phone}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Phone 2:{' '}
            </Typography>
            {data?.Resident?.optionalPhone}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Email:{' '}
            </Typography>
            {data?.Resident?.email}
          </Typography>
        </Box>
        <Box
          direction="column"
          spacing={2}
          sx={{
            p: 0.5,
            display: 'flex',
            flexDirection: 'column',
            width: '50%'
          }}
        >
          <Typography variant="h2" sx={{ fontSize: '1.6rem' }}>
            Room Details
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Room Number:{' '}
            </Typography>
            {data?.RentalRoom?.roomNumber}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Rent Price:{' '}
            </Typography>
            {data?.RentalRoom?.rentAmount}
          </Typography>
          <Typography>
            <Typography variant="overline" sx={{ fontSize: 'inherit' }}>
              Hotel:{' '}
            </Typography>
            {data?.RentalRoom?.Hotel?.name}
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={5}
        sx={{
          mt: 3,
          padding: 2,
          maxWidth: '100%',
          borderRadius: 5
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Contract File
        </Typography>
        <Tooltip title="View Contract">
          <Button variant="text" color="primary" onClick={() => handlePdfView(data.contract)}>
            Contract
          </Button>
        </Tooltip>
      </Paper>
      {openViewer && <DocReaderModal fileURL={fileURL} fileType="pdf" onClose={() => setOpenViewer(false)} />}
    </PageWrapper>
  );
};

export default RentalRoomReservationDetails;
