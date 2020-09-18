import { DataSource } from './DataSource';
import { FileDataSource } from './FileDataSource';
import { dataSource } from '../config.json';
import { SmartonFhirDataSource } from './SmartonFhirDataSource';


enum dataSourceTypes {
  FILE = 'file',
  SMART = 'smart'
}

export function getDataSource(): DataSource | null {
  switch (dataSource.type) {
    case dataSourceTypes.FILE:
      return new FileDataSource();
    case dataSourceTypes.SMART:
      return new SmartonFhirDataSource();
    default:
      return null;
  }
}
