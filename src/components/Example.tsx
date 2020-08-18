import React from 'react';
import { usePatient } from '../providers/PatientProvider';

const Example = () => {
  const { patientData } = usePatient();
  return <div>Patient Bundle has {patientData?.entry?.length} entries</div>;
};

export default Example;
