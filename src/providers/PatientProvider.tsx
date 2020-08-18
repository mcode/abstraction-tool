import React, { FC, memo, createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { getDataSource } from '../dataSource';

interface PatientProviderProps {
  children: ReactNode;
}

interface PatientContextInterface {
  patientData: R4.IBundle | null;
  setPatientData: Function;
}

export const PatientContext = createContext<PatientContextInterface>({
  patientData: null,
  setPatientData: (): void => {
    return;
  }
});

export const PatientProvider: FC<PatientProviderProps> = memo(({ children }) => {
  const [patientData, setPatientData] = useState();
  const dataSource = getDataSource();

  useEffect(() => {
    const data = dataSource?.getData();
    setPatientData(data);
  }, [dataSource, setPatientData]);

  return <PatientContext.Provider value={{ patientData, setPatientData }}>{children}</PatientContext.Provider>;
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const usePatient = (): PatientContextInterface => useContext(PatientContext)!;
