import { FileDataSource } from '../../dataSource/FileDataSource';
import bundle from '../fixtures/sample-patient-bundle.json';

test('dataSource loads bundle correctly', async () => {
  const dataSource = new FileDataSource();
  const data = await dataSource.getData();

  expect(data).toEqual(bundle);
});
