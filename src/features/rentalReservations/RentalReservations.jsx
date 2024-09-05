/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Paper, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import Loading from 'components/Loading';
import { useGetRentalRoomReservationsQuery } from '../admin/hotels/rentalRoomReservations/rentalRoomReservationsApiSlice';

import RenewRentalReservation from './RenewRentalReservation';
import UpdatePayment from './UpdatePayment';
import useAuth from 'hooks/useAuth';
import { useReactToPrint } from 'react-to-print';
import PaymentConfirmation from './PaymentConfirmation';
import MaterialTable from 'components/MaterialTable';
import { currency } from 'store/constant';
import BackButton from 'components/BackButton';
import HotelRentalReservations from './HotelRentalReservations';

const RentalReservations = () => {
  const [open, setOpen] = useState(false);
  const user = useAuth();
  const { data, isFetching, isSuccess } = useGetRentalRoomReservationsQuery();
  const [lastPaid, setLastPaid] = useState(null);
  const [printLoading, setPrintLoading] = useState({});
  const componentRef = useRef();
  const [reservation, setReservation] = React.useState(null);
  const [openUpdatePayment, setOpenUpdatePayment] = useState(false);
  const [rentalReservationHotels, setRentalReservationHotels] = useState(null);
  const [rentalReservationsByHotel, setRentalReservationsByHotels] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const reservationsData = data
    ?.map((reservation) => {
      return {
        ...reservation,
        RentalReservationReceipts: reservation.RentalReservationReceipts.slice(1)
      };
    })
    .filter((reservation) => reservation.status !== 'checkedOut');

  const shopRentalReservations = reservationsData?.filter((reservation) => reservation.Hotel.type === 'shop');

  const rentalReservations = reservationsData?.filter((reservation) => reservation.Hotel.type === 'residential');
  // separate rental reservations for each hotel
  const rowData = (user.role === 'careTaker') ? rentalReservations : shopRentalReservations;

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpenUpdatePayment = () => {
    setOpenUpdatePayment(true);
  };

  const handleCloseUpdatePayment = () => {
    setOpenUpdatePayment(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setTimeout(() => {
        setLastPaid(null);
      }, 1000);
    }
  });

  const onPrint = (id) => {
    setPrintLoading({ id, loading: true });

    const lastPaid = data?.find((reservation) => reservation.id === id).RentalReservationReceipts.at(-1);
    setLastPaid(() => ({ ...lastPaid }));

    setTimeout(() => {
      // setPrintLoading(null);
      setPrintLoading((prevState) => ({ ...prevState, loading: false }));

      handlePrint();
    }, 2000);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rentalRoomReservationsTodaysReceipts = rentalReservations?.map((reservation) => {
    return reservation.RentalReservationReceipts.filter(
      (receipt) => dayjs(receipt.createdAt).format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY')
    );
  });
  const shopRentalRoomReservationsTodaysReceipts = shopRentalReservations?.map((reservation) => {
    return reservation.RentalReservationReceipts.filter(
      (receipt) => dayjs(receipt.createdAt).format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY')
    );
  });

  const handleUpdateUnpaid = (id) => {
    const reservation = data?.find((reservation) => reservation.id === id);
    setReservation(reservation);
    handleClickOpenUpdatePayment();
  };

  const handleRenewal = (id) => {
    const reservation = data?.find((reservation) => reservation.id === id);
    setReservation(reservation);
    handleClickOpen();
  };

  const columns = [
    {
      Header: 'Receipt ID',
      accessorKey: 'id'
    },
    {
      Header: 'Room Number',
      accessorKey: 'roomNumber'
    },
    {
      Header: 'Resident',
      accessorKey: 'resident'
    },
    {
      Header: 'Date',
      accessorKey: 'createdAt',
      Cell: ({ value }) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      Header: `(${currency}) Total Amount`,
      accessorKey: 'totalAmount',
      Footer: (info) => {
        const total = React.useMemo(
          () =>
            info.table
              .getRowModel()
              .flatRows.map((row) => row.original.totalAmount)
              .reduce((a, b) => a + b, 0),
          [info.table]
        );

        return <>Total: R{total}</>;
      }
    }
  ];
  const cellStyle = {
    muiTableHeadCellProps: {
      align: 'center'
    },
    muiTableBodyCellProps: {
      align: 'center'
    }
  };
  const colsData = [
    {
      Header: 'Room No',
      accessorKey: 'roomNumber'
    },
    {
      Header: 'Resident',
      accessorKey: 'resident'
    },
    {
      Header: 'Unpaid Amount',
      accessorKey: 'unpaidAmount'
    },
    {
      Header: 'Renewed for',
      accessorKey: 'activePeriod'
    },
    {
      Header: 'Last Paid Amount',
      accessorKey: 'lastPaidAmount'
    },

    {
      Header: 'Paid By',
      accessorKey: 'paidBy'
    },
    {
      Header: 'Last Paid Date',
      accessorKey: 'lastPaidDate'
    },
    {
      Header: 'Status',
      accessorKey: 'status',
      ...(isMobile ? cellStyle : {}),
      Cell: ({ row }) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Badge badgeContent={row.original.status} color={row.original.status === 'active' ? 'success' : 'error'} />
        </Box>
      )
    }
  ];
  const mainColumns = isMobile ? colsData : colsData.map((column) => ({ ...column, ...cellStyle }));

  const leasedRoomsReceiptsRows = rentalRoomReservationsTodaysReceipts
    ?.map((receipt) => {
      return receipt.map((receipt) => {
        return {
          id: receipt.id,
          createdAt: receipt.createdAt,
          totalAmount: receipt.totalAmount,
          roomNumber: receipt.RentalRoomReservation.RentalRoom.room,
          resident: `${receipt.Resident.firstName} ${receipt.Resident.lastName}`
        };
      });
    })
    .flat();

  const leasedShopsReceiptsRows = shopRentalRoomReservationsTodaysReceipts
    ?.map((receipt) => {
      return receipt.map((receipt) => {
        return {
          id: receipt.id,
          createdAt: receipt.createdAt,
          totalAmount: receipt.totalAmount,
          roomNumber: receipt.RentalRoomReservation.RentalRoom.room,
          resident: `${receipt.Resident.firstName} ${receipt.Resident.lastName}`
        };
      });
    })
    .flat();

  useEffect(() => {
    const rentalsByHotel = rowData?.reduce((acc, reservation) => {
      const index = reservation.Hotel.id;
      if (!acc[index]) {
        acc[index] = [];
      }
      acc[index].push(reservation);
      return acc;
    }, {});
    setRentalReservationsByHotels(rentalsByHotel);
    if (isSuccess && rentalsByHotel) {
      const hotels = Object.keys(rentalsByHotel)?.map((hotel) => {
        return {
          id: hotel,
          name: rentalsByHotel[hotel][0].Hotel.name
        };
      });
      setRentalReservationHotels(hotels)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  return (
    <>
      {isFetching ? (
        <Loading />
      ) : (
        <>
          <Box
            sx={{
              mt: 2,
              mx: {
                xs: 'auto',
                sm: 'auto',
                md: 3,
                lg: 5
              },
              width: {
                xs: '100%',
                sm: '100%',
                md: '90vw',
                lg: '90vw'
              }
            }}
          >

            <Paper sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                {['receptionist', 'admin'].includes(user.role) && <BackButton />}

                <Typography
                  sx={{
                    flexGrow: 1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.75rem',
                    ml: '-5%',
                    color: 'secondary.main',
                    letterSpacing: '0.1rem',
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '1rem'
                    },
                    my: 2,
                    textTransform: 'uppercase'
                  }}
                >
                  Rental Reservations Renewal
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                  py: 2,
                  [theme.breakpoints.down('sm')]: {
                    flexDirection: 'column',
                    gap: '1rem'
                  }
                }}
              >

                <ToggleButtonGroup
                  color='secondary'
                  value={selectedHotel?.id}
                  onChange={(event, value) => {
                    setSelectedHotel(rentalReservationHotels?.find((hotel) => hotel.id === value))
                  }}
                  exclusive
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    py: 2,
                    [theme.breakpoints.down('sm')]: {
                      flexDirection: 'column',
                      gap: '1rem'
                    }
                  }}
                >
                  {rentalReservationHotels?.map((hotel) => (
                    <ToggleButton
                      value={hotel.id}
                      size='large'
                      aria-label={hotel.name}
                      sx={{
                        fontSize: '1.5rem',
                        [theme.breakpoints.down('sm')]: {
                          fontSize: '1rem'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'secondary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'secondary.main',
                            color: 'white'
                          }

                        }
                      }
                      }
                      key={hotel.id}
                      onClick={() => setSelectedHotel(hotel)}
                    >
                      {hotel.name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
              <Typography sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1rem'
                },
                my: 1,
                textTransform: 'uppercase'
              }}>
                {selectedHotel?.name}

              </Typography>

            </Paper>
            <>
              {selectedHotel && (

                <Paper sx={{ p: 2, mb: 2 }}>
                  <HotelRentalReservations
                    rows={rentalReservationsByHotel[selectedHotel?.id]}
                    columns={mainColumns}
                    handleRenewal={handleRenewal}
                    handleUpdateUnpaid={handleUpdateUnpaid}
                    name={
                      user?.role === 'careTaker'
                        ? `rental-room-reservations-payment`
                        : user?.role === 'receptionist'
                          ? 'rental-shop-reservations-payment'
                          : ''
                    }
                    onPrint={onPrint}
                    printLoading={printLoading}
                  />
                  {/* <MaterialTable
                name={
                  user?.role === 'careTaker'
                    ? 'rental-room-reservations-payment'
                    : user?.role === 'receptionist'
                      ? 'rental-shop-reservations-payment'
                      : ''
                }
                columns={mainColumns}
                rows={rowData?.map((reservation) => {
                  return {
                    id: reservation.id,
                    roomNumber: reservation.RentalRoom.roomNumber,
                    resident: `${reservation.Resident.firstName} ${reservation.Resident.lastName}`,
                    unpaidAmount: reservation.unpaidAmount,
                    activePeriod: reservation.activePeriod,
                    lastPaidAmount: reservation.RentalReservationReceipts.at(-1)?.totalAmount,
                    paidBy: reservation.RentalReservationReceipts.at(-1)?.paymentMethod,
                    lastPaidDate: dayjs.tz(reservation.RentalReservationReceipts.at(-1)?.paymentDate).format('DD/MM/YYYY'),
                    status: reservation.status
                  };
                })}
                mobileViewColumns={['roomNumber', 'status']}
                onPrint={onPrint}
                onUpdateUnpaid={handleUpdateUnpaid}
                onRenewal={handleRenewal}
                actions={true}
                printLoading={printLoading}
              /> */}
                </Paper>
              )}
            </>
          </Box >
          {leasedRoomsReceiptsRows?.length > 0 && user.role === 'careTaker' && (
            <Box
              sx={{
                mt: 4,
                mx: {
                  xs: 'auto',
                  sm: 'auto',
                  md: 3,
                  lg: 4
                },
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '60vw',
                  lg: '60vw'
                }
              }}
            >
              <Typography
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  [theme.breakpoints.up('md')]: {
                    display: 'none'
                  },
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '1rem'
                  },
                  mt: 5,
                  mb: 3,
                  textTransform: 'uppercase'
                }}
              >
                Leased Room Today&#39;s Collection
              </Typography>

              <MaterialTable
                name="Leased Room Today's Collection"
                columns={columns}
                rows={leasedRoomsReceiptsRows}
                mobileViewColumns={['id', 'RentalReservation.RentalRoom.roomNumber', 'totalAmount']}
              />
            </Box>
          )
          }
          {
            leasedShopsReceiptsRows?.length > 0 && user.role === 'receptionist' && (
              <Box
                sx={{
                  mt: 4,
                  mx: {
                    xs: 'auto',
                    sm: 'auto',
                    md: 3,
                    lg: 4
                  },
                  width: {
                    xs: '100%',
                    sm: '100%',
                    md: '60vw',
                    lg: '60vw'
                  }
                }}
              >
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    [theme.breakpoints.down('sm')]: {
                      fontSize: '1rem'
                    },
                    [theme.breakpoints.up('md')]: {
                      display: 'none'
                    },
                    mt: 5,
                    mb: 3,
                    textTransform: 'uppercase'
                  }}
                >
                  Leased Room Today&#39;s Collection
                </Typography>


                <MaterialTable
                  name="Leased Shops Today's Collection"
                  columns={columns}
                  rows={leasedShopsReceiptsRows}
                  mobileViewColumns={['id', 'RentalReservation.RentalRoom.roomNumber', 'totalAmount']}
                />
              </Box>
            )
          }
        </>
      )}

      {
        reservation !== null && (
          <>
            <RenewRentalReservation open={open} onClose={handleClose} reservation={reservation} />
            <UpdatePayment open={openUpdatePayment} onClose={handleCloseUpdatePayment} reservation={reservation} />
          </>
        )
      }
      <Box sx={{ display: 'none' }}>
        <PaymentConfirmation ref={componentRef} lastPaid={lastPaid} user={user} />
      </Box>
    </>
  );
};

export default RentalReservations;
