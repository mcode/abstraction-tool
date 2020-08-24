import { R4 } from '@ahryman40k/ts-fhir-types';
import { ValueSetMap } from '../types/valueset';
import { Library, Executor, Repository, CodeService } from 'cql-execution';
import { PatientSource } from 'cql-exec-fhir';

export default function executeElm(patientRecord: R4.IBundle, elm: any, valueSets: ValueSetMap): any {
  if (patientRecord && elm){
    let lib;
    if (valueSets) {
      lib = new Library(elm, new Repository(valueSets));
    }
    else {
      lib = new Library(elm);
    }
    const codeService = new CodeService(valueSets);
    const executor = new Executor(lib, codeService);
    const psource = new PatientSource.FHIRv400(patientRecord);
    psource.loadBundles(patientRecord);
    const patientResult = executor.exec(psource);

    return patientResult;
  }
  return null;
}