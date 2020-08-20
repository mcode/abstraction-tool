import { R4 } from '@ahryman40k/ts-fhir-types';
import { ValueSetMap } from '../types/valueset';

import { Library, Executor, Repository } from 'cql-execution';
import { PatientSource } from 'cql-exec-fhir';
import { Bundle } from 'fhir-objects';


export default function executeElm(patientRecord: R4.IBundle, elm: any, valueSets: ValueSetMap): any {
  // TODO: Implement execution of ELM
  if (patientRecord && elm){

    let lib;
    /*
    if (valueSets) {
      lib = new Library(elm, new Repository(valueSets));
    }
    else {
    */
      lib = new Library(elm);
    //}

    const executor = new Executor(lib);
    const psource = new PatientSource.FHIRv400(patientRecord);
    psource.loadBundles(patientRecord);

    //const result = executor.exec(psource)


    return JSON.stringify(psource);

  }


  return null;
}


// Add functionality for ValueSets