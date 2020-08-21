import { R4 } from '@ahryman40k/ts-fhir-types';

export abstract class DataSource {
  abstract getData(...args: any[]): R4.IBundle;
}
