import { SmartonFhirDataSource } from '../../dataSource/SmartonFhirDataSource';
import bundle from '../fixtures/sample-patient-bundle.json';

test('dataSource loads bundle correctly', async() => {
  const dataSource = new SmartonFhirDataSource();
  const data = await dataSource.getData();

  expect(data).toEqual(bundle);
});
