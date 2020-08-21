declare module 'cql-exec-fhir' {
    import { R4 } from '@ahryman40k/ts-fhir-types';
    export const PatientSource = {
      FHIRv400: class {
        constructor(patient: R4.IBundle);
        loadBundles(bundle: R4.IBundle): void;
      }
    };
  }