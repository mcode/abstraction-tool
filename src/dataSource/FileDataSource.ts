import { R4 } from '@ahryman40k/ts-fhir-types';
import { DataSource } from './DataSource';
import bundle from '../__tests__/fixtures/sample-patient-bundle.json';

export class FileDataSource extends DataSource {
  getData() {
    return bundle as R4.IBundle;
  }
}
