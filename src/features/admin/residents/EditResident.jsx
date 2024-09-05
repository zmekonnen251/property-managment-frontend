import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageWrapper from '../layouts/PageWrapper';
import { useFetchResidentQuery } from './residentsApiSlice';
import Loading from 'components/Loading';
import EditResidentForm from './EditResidentForm';

const EditResident = () => {
  const { residentId } = useParams();
  const location = useLocation();
  const { firstName, lastName } = location.state;
  const { data: resident, isFetching } = useFetchResidentQuery(residentId);

  return (
    <PageWrapper title={`Edit Resident - ${firstName} ${lastName}`}>
      {isFetching ? <Loading /> : <EditResidentForm defaultData={resident} />}
    </PageWrapper>
  );
};

export default EditResident;
