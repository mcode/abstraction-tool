import { R4 } from '@ahryman40k/ts-fhir-types';
import { DataSource } from './DataSource';
import FHIR from 'fhirclient';

export class SmartonFhirDataSource extends DataSource {
  async getData() {
    const client = await FHIR.oauth2.init({
      clientId: 'Input client id you get when you register the app',
      scope: 'launch/patient openid profile'
    });
    const patient = await client.patient.read();
    return {
      resourceType: 'Bundle',
      entry: [
        {
          resource: patient
        }
      ]
    } as R4.IBundle;
  }
}
