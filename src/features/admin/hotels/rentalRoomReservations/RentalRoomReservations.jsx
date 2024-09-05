import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Loading from 'components/Loading';
import {
  useDeleteRentalRoomReservationMutation,
  useGetHotelRentalRoomReservationsQuery,
  useCheckOutRentalReservationMutation
} from './rentalRoomReservationsApiSlice';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import MaterialTable from 'components/MaterialTable';
import { Button, Tooltip } from '@mui/material';
import DocReaderModal from 'components/DocReaderModal';
import useAuth from 'hooks/useAuth';

const RentalRoomReservations = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openViewer, setOpenViewer] = React.useState(false);
  const [fileURL, setFileURL] = React.useState('');
  const { data, isFetching } = useGetHotelRentalRoomReservationsQuery(id);
  const [deleteRentalRoomReservation, { isSuccess: isDeleteSuccess }] = useDeleteRentalRoomReservationMutation();
  const [checkOutRentalReservation, { isSuccess: isCheckoutSuccess }] = useCheckOutRentalReservationMutation();
  const user = useAuth()
  const handleView = (reservationId) => {
    navigate(`/dashboard/hotels/${id}/rental-room-reservations/${reservationId}`);
  };

  const handleDelete = async (reservationId) => {
    await deleteRentalRoomReservation(reservationId);
  };
  const handleRentalCheckOut = async (id) => {
    await checkOutRentalReservation(id);
  };

  const handlePdfView = (url) => {
    setFileURL(url);
    setOpenViewer(true);
  };

  if (isDeleteSuccess) {
    toast.success('Rental Room Reservation Deleted Successfully', {
      position: 'top-center',
      autoClose: 2000,
      toastId: 'deleteRentalRoomReservation'
    });
  }

  if (isCheckoutSuccess) {
    toast.success('Rental Room Reservation Checked Out Successfully', {
      position: 'top-center',
      autoClose: 2000,
      toastId: 'checkoutRentalRoomReservation'
    });
  }

  const rows = data
    ?.map((reservation) => ({
      id: reservation.id,
      roomNumber: reservation.RentalRoom?.roomNumber,
      residentName: `${reservation.Resident.firstName} ${reservation.Resident?.lastName}`,
      residentPhone: reservation.Resident?.phone,
      residentEmail: reservation.Resident?.email,
      dateIn: dayjs(reservation.dateIn).format('DD/MM/YYYY'),
      status: reservation.status === 'active' ? 'Occupied' : reservation.status === 'checkedOut' ? 'Checked Out' : 'Inactive',
      contract: reservation.contract,
      dateOut: reservation.dateOut
    })).reduce((acc, room) => {
      const index = parseInt(room.roomNumber) ? 0 : 1;
      acc[index].push(room);
      return acc;
    }, [[], []]).map(arr => arr.sort((a, b) => parseInt(a.roomNumber) - parseInt(b.roomNumber))).flat();


  const columns = [
    {
      Header: 'ID',
      accessorKey: 'id'
    },
    {
      Header: 'Unit Number',
      accessorKey: 'roomNumber'
    },
    {
      Header: 'Name',
      accessorKey: 'residentName'
    },
    {
      Header: 'Phone',
      accessorKey: 'residentPhone'
    },
    {
      Header: 'Email',
      accessorKey: 'residentEmail'
    },
    {
      Header: 'Date In',
      accessorKey: 'dateIn'
    },
    {
      Header: 'Status',
      accessorKey: 'status'
    },

    {
      Header: 'Contract (PDF)',
      accessorKey: 'contract',
      Cell: ({ row }) => (
        <Tooltip title="View Contract">
          <Button variant="text" color="primary" onClick={() => handlePdfView(row.original.contract)}>
            Contract
          </Button>
        </Tooltip>
      )
    }
  ];
  return (
    <PageWrapper title="Rental Room Reservations">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
          name="Leased Records"
          columns={columns}
          rows={rows}
          onView={handleView}
          onDelete={['admin', 'manager'].includes(user.role) && handleDelete}
          onRntalCheckOut={['admin', 'manager'].includes(user.role) && handleRentalCheckOut}
          addNewLink={['admin', 'manager'].includes(user.role) && `/dashboard/hotels/${id}/rental-room-reservations/new`}
          mobileViewColumns={['roomNumber', 'residentName', 'status']}
          actions={['admin', 'manager'].includes(user.role) && true}
        />
      )}
      {openViewer && <DocReaderModal fileURL={fileURL} fileType="pdf" onClose={() => setOpenViewer(false)} />}
    </PageWrapper>
  );
};

export default RentalRoomReservations;
