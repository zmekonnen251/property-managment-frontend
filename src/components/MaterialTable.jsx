import React, { useState, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
  useMediaQuery,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, PersonOffRounded, Visibility, PictureAsPdf, DoneOutline, Print, MoneyOffTwoTone, PersonAddAlt1Rounded } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import PulseLoader from 'react-spinners/PulseLoader';
import { LoadingButton } from '@mui/lab';
export const MaterialTable = ({
  columns,
  rows,
  onView,
  onUpdate,
  onDelete,
  name,
  addNewLink,
  onCheckOut,
  onRntalCheckOut,
  onChageRoomStatus,
  onChangeReady,
  onAddNew,
  actions = false,
  handleExport,
  mobileViewColumns = [],
  report = false,
  back = false,
  isRoomUpdateLoading,
  printLoading,
  onUpdateUnpaid,
  onRenewal,
  onPrint,
  onActivate
}) => {
  const user = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [idToBeDeleted, setIdToBeDeleted] = React.useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const columnsData = useMemo(
    //column definitions...
    () => columns,
    [columns]
    //end
  );

  const hideOnMobile = columnsData
    .filter((col) => !mobileViewColumns.includes(col.accessorKey))
    .reduce((acc, curr) => {
      acc[curr.accessorKey] = false;
      return acc;
    }, {});

  const renderRowActions = ({ row, closeMenu }) => {
    const actions = [];

    if (onView) {
      actions.push(
        <MenuItem
          key={1}
          onClick={() => {
            onView(row.original.id);
            closeMenu();
          }}
        >
          <Tooltip title="View">
            <Button variant="contained" size="small" color="warning" endIcon={<Visibility />} />
          </Tooltip>
        </MenuItem>
      );
    }

    if (onUpdate && ['admin', 'manager'].includes(user.role)) {
      actions.push(
        <MenuItem
          key={2}
          onClick={() => {
            onUpdate(row.original.id);
            closeMenu();
          }}
        >
          <Tooltip title="Edit">
            <Button variant="contained" size="small" color="primary" endIcon={<EditIcon />} />
          </Tooltip>
        </MenuItem>
      );
    }

    if (
      onUpdate &&
      name === 'reservations' &&
      ['receptionist', 'manager', 'admin'].includes(user.role) &&
      row.original.status === 'pending'
    ) {
      actions.push(
        <MenuItem
          key={2}
          onClick={() => {
            onUpdate(row.original.id);
            closeMenu();
          }}
        >
          <Tooltip title="Edit">
            <Button variant="contained" size="small" color="warning" endIcon={<EditIcon />} />
          </Tooltip>
        </MenuItem>
      );
    }
    if (onDelete && ['manager', 'admin'].includes(user?.role) && name === 'employees-list' && row?.original?.active) {
      actions.push(
        <MenuItem
          key={3}
          onClick={() => {
            setIdToBeDeleted(row.original.id);
            handleClickOpen();
            closeMenu();
          }}
        >
          <Tooltip title="Deactivate Employee">
            <Button variant="contained" size="small" color="warning" endIcon={<PersonOffRounded />} />
          </Tooltip>
        </MenuItem>
      );
    }
    if (onDelete && ['manager', 'admin'].includes(user?.role) && name !== 'employees-list') {
      actions.push(
        <MenuItem
          key={13}
          onClick={() => {
            setIdToBeDeleted(row.original.id);
            handleClickOpen();
            closeMenu();
          }}
        >
          <Tooltip title={"Delete"}>
            <Button variant="contained" size="small" color="warning" endIcon={< DeleteIcon />} />
          </Tooltip>
        </MenuItem>
      );
    }

    if (onActivate && ['manager', 'admin'].includes(user?.role) && !row?.original?.active) {
      actions.push(
        <MenuItem
          key={14}
          onClick={() => {
            onActivate(row.original.id)
            closeMenu();
          }}
        >
          <Tooltip title={"Activate Employee"}>
            <Button variant="contained" size="small" color="success" endIcon={<PersonAddAlt1Rounded />} />
          </Tooltip>
        </MenuItem>
      );
    }

    if (
      onCheckOut &&
      name === 'reservations' &&
      ['admin', 'manager', 'receptionist'].includes(user?.role) &&
      row.original.status !== 'checkedOut'
    ) {
      actions.push(
        <MenuItem
          key={4}
          onClick={() => {
            onCheckOut(row.original.id);
            closeMenu();
          }}
        >
          <Tooltip title="Check Out">
            <Button variant="contained" size="small" color="warning" endIcon={<DoneOutline />} />
          </Tooltip>
        </MenuItem>
      );
    }

    if (onRntalCheckOut && ['admin', 'manager'].includes(user?.role) && row.original.status !== 'Checked Out') {
      actions.push(
        <MenuItem
          key={5}
          onClick={() => {
            onRntalCheckOut(row.original.id);
            closeMenu();
          }}
        >
          <Tooltip title="Check Out">
            <Button variant="contained" size="small" color="warning" endIcon={<DoneOutline />} />
          </Tooltip>
        </MenuItem>
      );
    }

    if (name === 'rooms' && onChangeReady) {
      actions.push(
        <FormControl>
          <InputLabel labelId="is-ready">{isRoomUpdateLoading ? <PulseLoader size={4} color="#666" /> : 'Change Ready'}</InputLabel>

          <Switch
            labelId="is-ready"
            value={row.original.ready}
            onChange={(e) => {
              onChangeReady(row.orginal.id, e.target.value);
            }}
          />
        </FormControl>
      );
    }

    if (name === 'rooms' && onChageRoomStatus) {
      actions.push(
        <FormControl>
          <InputLabel labelId="status-check">{isRoomUpdateLoading ? <PulseLoader size={4} color="#666" /> : 'Change Status'}</InputLabel>
          <Switch
            labelId="status-check"
            value={row.orginal.status === 'available' ? true : false}
            onChange={(e) => {
              onChageRoomStatus(row.orginal.id, e.target.value);
            }}
          />
        </FormControl>
      );
    }

    if (
      ['rental-room-reservations-payment', 'rental-shop-reservations-payment'].includes(name) &&
      onRenewal &&
      row.original.unpaidAmount <= 0
    ) {
      actions.push(
        <MenuItem
          key={6}
          onClick={() => {
            onRenewal(row.original.id);
            closeMenu();
          }}
        >
          <Tooltip title="Renewal">
            <Button variant="contained" size="small" color="warning" endIcon={<MoneyOffTwoTone />}>
              Renew
            </Button>
          </Tooltip>
        </MenuItem>
      );
    }

    if (
      ['rental-room-reservations-payment', 'rental-shop-reservations-payment'].includes(name) &&
      onUpdateUnpaid &&
      row.original.unpaidAmount > 0
    ) {
      actions.push(
        <MenuItem
          key={7}
          onClick={() => {
            onUpdateUnpaid(row.original.id);
            closeMenu();
          }}
        >
          <Tooltip title="Update Unpaid">
            <Button variant="contained" size="small" color="warning" endIcon={<EditIcon />}>
              Update Unpaid
            </Button>
          </Tooltip>
        </MenuItem>
      );
    }

    if (['rental-room-reservations-payment', 'rental-shop-reservations-payment'].includes(name) && onPrint) {
      actions.push(
        <MenuItem
          key={8}
          onClick={() => {
            onPrint(row.original.id);
            !printLoading?.loading && closeMenu();
          }}
        >
          <Tooltip title="Print">
            <LoadingButton loading={printLoading?.loading} variant="contained" color="info" endIcon={<Print />} loadingPosition="end">
              Print Latest Receipt
            </LoadingButton>
          </Tooltip>
        </MenuItem>
      );
    }

    return actions;
  };

  const renderTopToolbarCustomActions = () => {
    return (
      <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {back && <BackButton />}
        {handleExport && (
          <Button startIcon={<PictureAsPdf />} variant="contained" onClick={handleExport}>
            <Typography
              variant="h6"
              sx={{
                fontSize: '14px',
                fontWeight: 'bold',
                [theme.breakpoints.down('sm')]: {
                  display: 'none'
                }
              }}
            >
              Export as PDF
            </Typography>
          </Button>
        )}

        {onAddNew && (
          <Button variant="contained" size="medium" color="primary" onClick={onAddNew}>
            Add New
          </Button>
        )}
        {addNewLink && (
          <Button variant="contained" size="medium" color="primary" onClick={() => navigate(addNewLink)}>
            Add New
          </Button>
        )}
        {name && !report && (
          <Typography
            variant="h2"
            sx={{
              textTransform: 'uppercase',
              textAlign: 'left',
              [theme.breakpoints.down('sm')]: {
                display: 'none'
              },
              mr: 3
            }}
          >
            {name.includes('-') ? name.split('-').join(' ') : name.includes('_') ? name.split('_').join(' ') : name}
          </Typography>
        )}
      </Box>
    );
  };

  const rowDetails = ({ row }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        py: 1,
        px: 2,
        width: '85vw',
        maxWidth: '100%',
        margin: '0 auto',
        borderBottom: '1px solid rgba(81, 81, 81, 1)'
      }}
    >
      {columnsData.map((col, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
            px: 1,
            borderBottom: '1px solid rgba(81, 81, 81, 1)'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {col.header || col.Header}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'right'
            }}
          >
            {row.original[col.accessorKey]}
          </Typography>
        </Box>
      ))}
    </Box>
  );
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <MaterialReactTable
          data={rows ?? []}
          columns={columnsData.map((c) => ({
            ...c,
            minSize: 40,
            maxSize: 80
          }))}
          // density='compact'
          layoutMode="grid" //
          renderRowActionMenuItems={actions && renderRowActions}
          positionActionsColumn="last"
          renderTopToolbarCustomActions={renderTopToolbarCustomActions}
          muiTopToolbarProps={{
            sx: {
              alignItems: 'center'
            }
          }}
          enableColumnActions={false}
          enableRowActions={actions}
          enableSorting={false}
          displayColumnDefOptions={{
            'mrt-row-numbers': {
              enableHiding: false
            }
          }}
          initialState={{
            expanded: false
          }}
          state={{
            columnVisibility: isMobile ? hideOnMobile : {}
          }}
          renderDetailPanel={isMobile && rowDetails}
          muiTableProps={{
            sx: {
              border: '1px solid rgba(81, 81, 81, 1)'
            }
          }}
          muiTableHeadRowProps={{
            sx: {
              '& .MuiTableCell-root': {
                width: '3rem',
                px: '0.5rem'
              }
            }
          }}
          muiTableBodyProps={{
            sx: {
              '& .MuiTableCell-root': {
                width: '3rem',
                px: '0.5rem'
              }
            }
          }}
          muiBottomToolbarProps={{
            sx: {
              '& .MuiTablePagination-toolbar': {
                pb: '0.5rem'
              }
            }
          }}
          muiTableFooterProps={{
            sx: {
              '& .MuiTableFooter-root': {
                width: '100%'
              }
            }
          }}
          muiTableFooterCellProps={{
            sx: {
              '& .MuiTableCell-root': {
                align: 'right',
                textAlign: 'right'
              }
            }
          }}
        />
      </Box>
      <div>
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="dialog-title">
          <DialogTitle id="dialog-title">Delete Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to {name === 'employees-list' ? 'deactivate' : 'delete'} ?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              No
            </Button>
            <Button
              onClick={() => {
                onDelete(idToBeDeleted);
                handleClose();
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default MaterialTable;
