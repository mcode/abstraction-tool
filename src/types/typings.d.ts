import { R4 } from '@ahryman40k/ts-fhir-types';

// ------ cql-exec.fhir.d.ts ----------------------

declare module 'cql-exec-fhir' {
  export const PatientSource = {
    FHIRv400: class {
      constructor(patient: R4.IBundle);
      loadBundles(bundle: R4.IBundle): void;
    }
  };
}

// ------ cql-execution.d.ts ----------------------

declare module 'cql-execution' {
  import { ValueSetMap } from './valueset';

  export class Library {
    constructor(elm: object, repo?: Repository);
  }

  export class Executor {
    constructor(library: Library, codeService: CodeService);
    exec(patientsource: PatientSource);
  }

  export class Repository {
    constructor(elm: object);
  }

  export class CodeService {
    constructor(valueSetsJson: ValueSetMap);
  }
}

// ------ datasource.d.ts -------------------------

export enum dataSourceTypes {
  FILE = 'file'
}

// ------ valueset.d.ts ---------------------------

export interface ValueSetMap {
  [key: string]: {
    [key: string]: R4.ICoding[];
  };
}

// ------ window.t.ts -----------------------------

export {};
declare global {
  interface Window {
    LForms: any;
  }
}
