import { FileDataSource } from '../../dataSource/FileDataSource';
import bundle from '../fixtures/sample-patient-bundle.json';

test('dataSource loads bundle correctly', () => {
  const dataSource = new FileDataSource();
  const data = dataSource.getData();

  expect(data).toEqual(bundle);
});
