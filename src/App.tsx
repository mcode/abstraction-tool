import React, { useState, useEffect } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { getDataSource } from './dataSource';
import { PatientProvider } from './providers/PatientProvider';

const dataSource = getDataSource();

function App() {
  const [patientData, setPatientData] = useState();

  useEffect(() => {
    const data = dataSource?.getData() as R4.IBundle;
    setPatientData(data);
  }, []);

  return (
    <PatientProvider value={{ patientData, setPatientData }}>
      <div>Patient bundle found with {patientData?.entry.length} resources</div>
    </PatientProvider>
  );
}

export default App;
