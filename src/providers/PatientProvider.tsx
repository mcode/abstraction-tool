import React, { FC, createContext, useContext, ReactNode } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';

interface PatientProviderProps {
  children: ReactNode;
  value: PatientContextInterface;
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

export const PatientProvider: FC<PatientProviderProps> = ({ children, value }) => {
  return value.patientData == null ? (
    <div>Loading...</div>
  ) : (
    <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const usePatient = (): PatientContextInterface => useContext(PatientContext)!;
