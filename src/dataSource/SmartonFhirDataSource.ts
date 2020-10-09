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

    const record = await getPatientRecord(client);
    const values = ['id', 'meta', 'resourceType'];
    const records = record.filter((resource: any) => {
      return !Object.keys(resource).every(value => values.includes(value));
    });

    const entries = records.map((record: R4.IDomainResource[]) => {
      return {
        resource: record
      };
    });

    return {
      resourceType: 'Bundle',
      type: 'collection',
      entry: entries
    } as R4.IBundle;
  }
}
