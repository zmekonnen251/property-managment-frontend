import React from 'react';
import Loading from 'components/Loading';

import PageWrapper from '../layouts/PageWrapper';
import { useFetchResidentsQuery, useDeleteResidentMutation } from './residentsApiSlice';
import MaterialTable from 'components/MaterialTable';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const residentsColumns = [
  {
    Header: 'ID',
    accessorKey: 'id'
  },
  {
    Header: 'Name',
    accessorKey: 'name'
  },
  {
    Header: 'Email',
    accessorKey: 'email'
  },
  {
    Header: 'Phone',
    accessorKey: 'phone'
  },
  {
    Header: 'Optional Phone',
    accessorKey: 'optionalPhone'
  },
  {
    Header: 'ID Type',
    accessorKey: 'idType'
  },
  {
    Header: 'ID Number',
    accessorKey: 'idNumber'
  }
];

const Residents = () => {
  const navigate = useNavigate();
  const user = useAuth()
  const { data, isFetching } = useFetchResidentsQuery();
  const [deleteResident, { isSuccess, isLoading: isDeleteLoading }] = useDeleteResidentMutation();
  const residentsRow = data?.map((resident) => {
    return {
      ...resident,
      name: `${resident.firstName} ${resident.lastName}`
    };
  });

  const handleUpdate = (id) => {
    const resident = data.find((e) => e.id === id);
    navigate(`/dashboard/residents/${id}/edit`, {
      state: {
        firstName: resident.firstName,
        lastName: resident.lastName
      }
    });
  };

  const handleDelete = async (id) => {
    await deleteResident(id);
  };

  const handleAddNew = () => {
    navigate('/dashboard/residents/new-resident');
  };

  if (isSuccess) {
    toast.success('Resident deleted successfully', {
      autoClose: 2000,
      toastId: 'delete-resident'
    });
  }

  if (isDeleteLoading) {
    toast.loading('Deleting resident...', {
      toastId: 'delete-resident-loading',
      autoClose: isDeleteLoading ? false : 2000
    });
  }

  return (
    <PageWrapper title="Residents List">
      {isFetching ? (
        <Loading />
      ) : (
        <MaterialTable
          columns={residentsColumns}
          rows={residentsRow}
          name="Residents List"
          mobileViewColumns={['name', 'email', 'phone']}
          onDelete={['admin', 'manager'].includes(user.role) && handleDelete}
          onUpdate={['admin', 'manager'].includes(user.role) && handleUpdate}
          onAddNew={['admin', 'manager'].includes(user.role) && handleAddNew}
          actions={['admin', 'manager'].includes(user.role)}
        />
      )}
    </PageWrapper>
  );
};

export default Residents;
