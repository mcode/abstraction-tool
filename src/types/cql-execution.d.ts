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
