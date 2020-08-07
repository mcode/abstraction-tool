import { DataSource } from './DataSource';
import { FileDataSource } from './FileDataSource';
import { dataSource } from '../config.json';

enum dataSourceTypes {
  FILE = 'file'
}

export function getDataSource(): DataSource | null {
  switch (dataSource.type) {
    case dataSourceTypes.FILE:
      return new FileDataSource();
    default:
      return null;
  }
}
