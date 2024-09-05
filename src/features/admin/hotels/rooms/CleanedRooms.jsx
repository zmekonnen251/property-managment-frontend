import React from 'react';
import { Stack, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import MaterialTable from 'components/MaterialTable';
import Loading from 'components/Loading';
import { useGetCleanedRoomsNoteQuery } from '../hotelsApiSlice';
import dayjs from 'dayjs';
import PageWrapper from 'features/admin/layouts/PageWrapper';
import exportPdfTable from 'utils/pdfTableExport';

const columns = [
  {
    Header: 'ID',
    accessorKey: 'id'
  },
  {
    Header: 'Date',
    accessorKey: 'createdAt',
    Cell: ({ row }) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        {dayjs(row.original.createdAt).format('DD/MM/YYYY')}
      </Stack>
    )
  },
  {
    Header: 'Property',
    accessorKey: 'hotelName'
  },
  {
    Header: 'Cleaned Rooms',
    accessorKey: 'roomNumbers'
  }
];

const CleanedRooms = () => {
  const { id } = useParams();
  const { data, isFetching } = useGetCleanedRoomsNoteQuery(id);
  const rows = data?.map((item) => {
    return {
      ...item,
      hotelName: item.Hotel.name,
      date: dayjs(item.createdAt).format('DD/MM/YYYY')
    };
  });
  const columnsPdf = [
    {
      Header: 'ID',
      accessorKey: 'id'
    },
    {
      Header: 'Date',
      accessorKey: 'date',
    },
    {
      Header: 'Property',
      accessorKey: 'hotelName'
    },
    {
      Header: 'Cleaned Rooms',
      accessorKey: 'roomNumbers'
    }
  ];
  const downloadPdf = () => {
    const title = `Cleaned Rooms`;
    const footer = ['', '', ''];
    const fileName = `${dayjs().format('YYYY-MM-DD HH:mm')}-cleaned-rooms.pdf`;
    exportPdfTable(columnsPdf, rows, title, footer, fileName);
  };
  return (
    <PageWrapper title="Cleaned Rooms">
      <Box
        sx={{
          width: '100%'
        }}
      >
        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Loading />
          </Box>
        ) : (
          <MaterialTable
            name="Cleaned Rooms"
            rows={rows}
            columns={columns}
            actions={false}
            mobileViewColumns={['roomNumbers', 'hotelName', 'date']}
            handleExport={downloadPdf}
          />
        )}
      </Box>
    </PageWrapper>
  );
};

export default CleanedRooms;
