import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PageWrapper from '../layouts/PageWrapper';
import { useGetHotelsQuery } from '../hotels/hotelsApiSlice';
import { useGetEmployeeQuery } from './employeesApiSlice';
import Loading from 'components/Loading';
import EditEmployeeForm from './EditForm';

const EditEmployee = () => {
  const { id } = useParams();
  const location = useLocation();
  const { firstName, lastName } = location.state;
  const { data: employee, isFetching: isEmployeeDataFetching } = useGetEmployeeQuery(id);
  const { data: hotels, isFetching: isHotelsFetching } = useGetHotelsQuery();

  return (
    <PageWrapper title={`Edit Employee - ${firstName} ${lastName}`}>
      {isHotelsFetching || isEmployeeDataFetching ? <Loading /> : <EditEmployeeForm defaultData={employee} hotelsData={hotels} />}
    </PageWrapper>
  );
};

export default EditEmployee;
