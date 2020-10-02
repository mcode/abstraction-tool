import { R4 } from '@ahryman40k/ts-fhir-types';
import { DataSource } from './DataSource';
import FHIR from 'fhirclient';
import { getPatientRecord } from '../utils/fhirextractor';

export class SmartonFhirDataSource extends DataSource {
  async getData() {
    const client = await FHIR.oauth2.init({
      clientId: 'Input client id you get when you register the app',
      scope: 'launch/patient openid profile'
    });
    const patient = await client.patient.read();
    getPatientRecord(client).then((records: R4.IDomainResource[]) => {
      // filters out values that are empty
      // the server might return deleted
      // resources that only include an
      // id, meta, and resourceType
      const values = ['id', 'meta', 'resourceType'];
      records = records.filter(resource => {
        return !Object.keys(resource).every(value => values.includes(value));
      });
      console.log(records);
    })
    return {
      resourceType: 'Bundle',
      entry: [
        {
          resource: patient
        }
      ]
    } as R4.IBundle;
  }
//print the bundle that comes - 
//if it's a bundle that includes patient resource we can just return that and if it is an array and we need to change the entry to include those resources
}
