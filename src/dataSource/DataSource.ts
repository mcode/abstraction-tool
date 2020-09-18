import { R4 } from '@ahryman40k/ts-fhir-types';

export abstract class DataSource {
  abstract async getData(...args: any[]): Promise<R4.IBundle>;
}
