import { R4 } from '@ahryman40k/ts-fhir-types';
import _ from 'lodash';
import { ValueSetMap } from '../types/valueset';
import axios from 'axios';

export class ValueSetLoader {
  library: R4.ILibrary;
  contextBundle: R4.IBundle;

  constructor(library: R4.ILibrary, contextBundle: R4.IBundle) {
    this.library = library;
    this.contextBundle = contextBundle;
  }

  async seedValueSets(): Promise<ValueSetMap> {
    const map: ValueSetMap = {};
    const valueSetUrls = _.flatten(
      (this.library.dataRequirement ?? []).map(d => d.codeFilter?.filter(cf => cf.valueSet).map(cf => cf.valueSet))
    );
    valueSetUrls.forEach(async url => {
      const matchingEntry = this.contextBundle.entry?.find(e => e.fullUrl === url);
      const resource = matchingEntry ? (matchingEntry.resource as R4.IValueSet) : await this.getFromUrl(url!);
      if (resource.id && resource.version && resource.compose) {
        const codes = _.flatten(
          resource.compose.include.map(i => {
            return (i.concept ?? []).map(c => ({
              code: c.code,
              system: i.system ?? ''
            }));
          })
        );
        map[resource.id] = {
          [resource.version]: codes
        };
      }
    });
    return map;
  }

  async getFromUrl(url: string): Promise<R4.IValueSet> {
    const response = await axios.get(url);
    return response.data;
  }
}
