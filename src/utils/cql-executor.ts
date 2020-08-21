import { R4 } from '@ahryman40k/ts-fhir-types';
import { ValueSetMap } from '../types/valueset';

import { Library, Executor, Repository, CodeService } from 'cql-execution';
import { PatientSource } from 'cql-exec-fhir';
import { Bundle } from 'fhir-objects';


export default function executeElm(patientRecord: R4.IBundle, elm: any, valueSets: ValueSetMap): any {
  // TODO: Implement execution of ELM
  if (patientRecord && elm){

    console.log(patientRecord, elm, valueSets);

    let lib;
    /*
    if (valueSets) {
      lib = new Library(elm, new Repository(valueSets));
    }
    else {
    */
    lib = new Library(elm);
    //}

    const codeService = new CodeService(valueSets);

    const executor = new Executor(lib, codeService);
    
    const psource = new PatientSource.FHIRv400(patientRecord);
    psource.loadBundles(patientRecord);
   

    // Handle Value Sets
    //codeService = new CodeService(valueSets);

    const result = executor.exec(psource);

    console.log(result)

    //return JSON.stringify(psource);
    return result;

  }


  return null;
}


// Add functionality for ValueSets