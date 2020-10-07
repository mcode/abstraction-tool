import { SmartonFhirDataSource } from '../../dataSource/SmartonFhirDataSource';
import bundle from '../fixtures/sample-patient-bundle.json';
import FHIR from 'fhirclient';

const fhirClient = FHIR.oauth2.init({
  // note that mocking out the endpoint is made much easier
  // if there is no proxy between here and the endpoint
  // (either no proxy at all, or the no_proxy environment variable is set)
  serviceUrl: 'http://localhost/fhir',
  patientId: '1078857'
});



const client = FHIR.oauth2.init({
  clientId: 'Input client id you get when you register the app',
  scope: 'launch/patient openid profile'
});

test('dataSource loads bundle correctly', async () => {

  window.FHIR = {
    oauth2: {
        ready: function(callback: any) {
            callback(fhirClient);
        }
    }
}
  const dataSource = new SmartonFhirDataSource();
  const data = await dataSource.getData();

  expect(data).toEqual(bundle);
});
