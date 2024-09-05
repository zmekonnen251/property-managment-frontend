import React from 'react';
import { Avatar, Stack, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useGetEmployeesQuery, useDeleteEmployeeMutation, useActivateEmployeeMutation } from './employeesApiSlice';
import Loading from '../../../components/Loading';
import PageWrapper from '../layouts/PageWrapper';
import MaterialTable from 'components/MaterialTable';
import useAuth from 'hooks/useAuth';

const columns = [
  {
    Header: 'Name',
    accessorKey: 'name',
    Cell: ({ row }) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={row.original.firstName} src={row?.original?.photo} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {row.original.name}
          </Typography>
        </Box>
      </Stack>
    )
  },

  {
    Header: 'Role',
    accessorKey: 'role'
  },
  {
    Header: 'Properties',
    accessorKey: 'hotelNames'
  },
  {
    Header: 'Salary',
    accessorKey: 'salary'
  },
  {
    Header: 'Hired At',
    accessorKey: 'hiredAt'
  },
  {
    Header: 'Phone',
    accessorKey: 'phone'
  },
  {
    Header: 'Active',
    accessorKey: 'active',
    Cell: ({ row }) => (
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {row.original.active ? 'Yes' : 'No'}
      </Typography>
    )
  }
];

const Employees = () => {
  const navigate = useNavigate();
  const user = useAuth()
  const { data, isLoading } = useGetEmployeesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [activateEmployee] = useActivateEmployeeMutation();
  const handleView = (id) => {
    navigate(`/dashboard/employees/${id}`);
  };

  const rows = data
    ?.filter((e) => e.role !== 'admin')
    .map((employee) => {
      return {
        ...employee,
        name: `${employee.firstName} ${employee.lastName}`,
        hiredAt: dayjs(employee.hiredAt).format('DD/MM/YYYY')
      };
    });

  const handleUpdate = (id) => {
    const employee = data.find((e) => e.id === id);
    navigate(`/dashboard/employees/${id}/edit`, {
      state: {
        firstName: employee.firstName,
        lastName: employee.lastName
      }
    });
  };

  const handleDelete = async (id) => {
    await deleteEmployee(id);
  };
  const onActivate = async (id) => {
    await activateEmployee(id);
  }

  return (
    <PageWrapper title="Employees List">
      {isLoading ? (
        <Loading />
      ) : (
        <MaterialTable
          name="employees-list"
          columns={columns}
          rows={rows}
          onView={handleView}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onActivate={onActivate}
          mobileViewColumns={['firstName', 'lastName', 'role']}
          addNewLink={'/dashboard/employees/new-employee'}
          actions={['admin', 'manager'].includes(user.role)}
        />
      )}
    </PageWrapper>
  );
};

export default Employees;
