import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Divider,
	Button,
	Grid,
} from '@mui/material';
import { EmailSharp, Print } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import useAuth from 'hooks/useAuth';
import RoomTableRow from '../admin/hotels/rooms/RoomTableRow';
import Loading from 'components/Loading';
import ReservationConfirmation from './ReservationConfirmation';
import {
	useFetchReservationQuery,
	useSendReservationConfirmationEmailMutation,
} from '../admin/hotels/reservations/reservationsApiSlice';
import BackButton from 'components/BackButton';
import { currency } from 'store/constant';

const ReservationDetails = () => {
	const { reservationId, id } = useParams();
	const navigate = useNavigate();
	const componentToPrintRef = useRef();
	const { data, isSuccess, isFetching } =
		useFetchReservationQuery(reservationId);
	const [
		sendReservationConfirmationEmail,
		{ isSuccess: isSendEmailSuccess, isLoading: isSendEmailLoading },
	] = useSendReservationConfirmationEmailMutation();
	const user = useAuth();

	if (isFetching) {
		return <Loading />;
	}

	if (isSendEmailSuccess) {
		toast.success('Email sent successfully', {
			toastId: 'send-email',
			position: 'top-center',
		});
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<Paper
				elevation={1}
				sx={{
					p: 2,
					width: '100%',
					mt: 2,
					mb: 2,
					boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
					borderRadius: '8px',
					maxWidth: {
						lg: '1100px',
						md: '1100px',
						xs: '100%',
					},
					minWidth: {
						lg: '1100px',
						md: '1100px',
						xs: '100%',
					},
				}}
			>
				<Typography
					variant='h4'
					sx={{
						fontSize: { lg: '2.5rem', xs: '1.5rem', md: '1.8rem' },
						color: '#2e7d32',
					}}
				>
					Reservation Details
				</Typography>

				{isSuccess && (
					<Box sx={{ my: 0 }}>
						<Box sx={{ display: 'flex', gap: 1 }}>
							<Box sx={{ my: 2 }}>
								<BackButton />
							</Box>

							<Box sx={{ my: 2 }}>
								<Button
									variant='outlined'
									onClick={() => navigate(`/hotels/${id}`)}
								>
									Home
								</Button>
							</Box>
							{user.isAdmin && (
								<Box sx={{ my: 2 }}>
									<Button
										variant='outlined'
										onClick={() =>
											navigate(
												`/hotels/${id}/reservations/${reservationId}/edit`
											)
										}
									>
										Edit
									</Button>
								</Box>
							)}
							{user.role === 'receptionist' && data.status === 'pending' && (
								<Box sx={{ my: 2 }}>
									<Button
										variant='outlined'
										onClick={() =>
											navigate(
												`/hotels/${id}/reservations/${reservationId}/edit`
											)
										}
									>
										Edit
									</Button>
								</Box>
							)}

							<Box sx={{ my: 2 }}>
								<ReactToPrint
									trigger={() => (
										<Button variant='outlined' endIcon={<Print />}>
											Print
										</Button>
									)}
									content={() => componentToPrintRef.current}
								/>
								<Box
									sx={{
										display: 'none',
									}}
								>
									<ReservationConfirmation
										ref={componentToPrintRef}
										reservation={data}
									/>
								</Box>
							</Box>
							<Box sx={{ my: 2 }}>
								<LoadingButton
									loading={isSendEmailLoading}
									endIcon={<EmailSharp />}
									variant='outlined'
									onClick={async () => {
										await sendReservationConfirmationEmail(reservationId);
									}}
								>
									Send Email
								</LoadingButton>
							</Box>
						</Box>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<Paper
								sx={{
									padding: '30px',
									maxWidth: '1100px',
									width: '100%',
									boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
									borderRadius: '8px',
								}}
							>
								<Grid container spacing={2}>
									<Grid item xs={12} md={6}>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Date In:{' '}
											</Typography>
											{dayjs.tz(dayjs(data?.dateIn)).format('DD-MM-YYYY:HH:mm')}
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Date Out:{' '}
											</Typography>
											{dayjs
												.tz(dayjs(data?.dateOut))
												.format('DD-MM-YYYY:HH:mm')}
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Paid Amount:{' '}
											</Typography>
											{data?.paidAmount.toLocaleString('en-US', {
												style: 'currency',
												currency: currency,
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Paid By:{' '}
											</Typography>
											{data?.paidBy}
										</Typography>
									</Grid>
									<Divider sx={{ my: 2 }} />
									<Grid item xs={12} md={6}>
										<Typography variant='h2' sx={{ fontSize: '1.6rem' }}>
											Guest Details
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												First Name:{' '}
											</Typography>
											{data?.Guest?.firstName}
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Last Name:{' '}
											</Typography>
											{data?.Guest?.lastName}
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Phone:{' '}
											</Typography>
											{data?.Guest?.phone}
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Optional phone:{' '}
											</Typography>
											{data?.Guest?.optionalPhone}
										</Typography>
										<Typography>
											<Typography
												variant='overline'
												sx={{ fontSize: 'inherit' }}
											>
												Email:{' '}
											</Typography>
											{data?.Guest?.email}
										</Typography>
									</Grid>
									<Divider sx={{ my: 2 }} />
									<Grid item xs={12} md={6}>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
											}}
										>
											<Typography variant='h2' sx={{ fontSize: '1.6rem' }}>
												Room Details
											</Typography>
											{data?.Rooms.map((room) => (
												<Box
													key={room.id}
													sx={{
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'flex-start',
													}}
												>
													<Typography
														variant='overline'
														sx={{
															fontSize: 'inherit',
															textTransform: 'capitalize',
														}}
													>
														Room No.: {room.roomNumber}
													</Typography>
													<Typography
														variant='overline'
														sx={{
															fontSize: 'inherit',
															textTransform: 'capitalize',
														}}
													>
														Room Type: {room.RoomType.name}
													</Typography>
													<Typography
														variant='overline'
														sx={{
															fontSize: 'inherit',
															textTransform: 'capitalize',
														}}
													>
														Room Price:{currency} {room.RoomType.currentPrice}
													</Typography>
													<Typography
														variant='overline'
														sx={{
															fontSize: 'inherit',
															textTransform: 'capitalize',
														}}
													>
														Room Capacity: {room.RoomType.capacity}
													</Typography>
												</Box>
											))}

											<Typography
												variant='overline'
												sx={{
													fontSize: 'inherit',
													textTransform: 'capitalize',
													fontStyle: 'bold',
												}}
											>
												Total Price: {currency} {data?.paidAmount}
											</Typography>
										</Box>
									</Grid>

									<Divider sx={{ my: 2 }} />
									<Grid item xs={12} md={6}>
										<Box
											spacing={2}
											sx={{
												mt: 1,
												p: 0.5,
												display: 'flex',
												flexDirection: 'column',
												width: '50%',
											}}
										>
											<Typography variant='h2' sx={{ fontSize: '1.6rem' }}>
												CreatedBy (Staff Details)
											</Typography>
											<Typography>
												<Typography
													variant='overline'
													sx={{ fontSize: 'inherit' }}
												>
													First Name:{' '}
												</Typography>
												{data?.Employee?.firstName}
											</Typography>
											<Typography>
												<Typography
													variant='overline'
													sx={{ fontSize: 'inherit' }}
												>
													Last Name:{' '}
												</Typography>
												{data?.Employee?.lastName}
											</Typography>
											<Typography>
												<Typography
													variant='overline'
													sx={{ fontSize: 'inherit' }}
												>
													Phone:{' '}
												</Typography>
												{data?.Employee?.phone}
											</Typography>
										</Box>
									</Grid>
								</Grid>
							</Paper>
						</Box>
						<Divider sx={{ my: 2 }} />
						<Paper
							sx={{
								padding: '20px',
								maxWidth: '1100px',
								width: '100%',
								boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
								borderRadius: '8px',
							}}
						>
							<Box sx={{ my: 5 }}>
								<Typography
									variant='h2'
									sx={{
										fontSize: '2.2rem',
										marginBottom: '8px',
										color: '#2e7d32',
									}}
								>
									Rooms
								</Typography>
							</Box>

							{data?.Rooms.length > 0 ? (
								<TableContainer
									component={Paper}
									sx={{
										mt: 2,
										maxWidth: '1100px',
										mb: 4,
										boxShadow: '0 0 20px rgba(0, 0, 0, 0.3',
									}}
									elevation={6}
								>
									<Table sx={{ minWidth: 1000 }} aria-label='simple table'>
										<TableHead>
											<TableRow>
												<TableCell align='left'>Room No</TableCell>
												<TableCell align='left'>Status</TableCell>
												<TableCell align='left'>Smoking</TableCell>
												<TableCell align='left'>Room Type</TableCell>
												<TableCell align='left'>Ready</TableCell>
												<TableCell align='left'>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{data?.Rooms.map((room) => (
												<RoomTableRow key={room.id} room={room} />
											))}
										</TableBody>
									</Table>
								</TableContainer>
							) : (
								<Typography sx={{ textAlign: 'center' }}>
									There is no reserved rooms!
								</Typography>
							)}
						</Paper>
					</Box>
				)}

				{!isSuccess && (
					<Typography sx={{ textAlign: 'center' }}>
						There is no reservation with id {reservationId}
					</Typography>
				)}
			</Paper>
		</Box>
	);
};

export default ReservationDetails;
