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

  seedValueSets(): ValueSetMap {
    const map: ValueSetMap = {};
    const valueSetIDs = _.flatten(
      (this.library.dataRequirement ?? []).map(d => d.codeFilter?.filter(cf => cf.valueSet).map(cf => cf.valueSet))
    );
    valueSetIDs.forEach(id => {
      const matchingEntry = this.contextBundle.entry?.find(e => e.resource?.id === id);
      if(!matchingEntry) {
        const matchingEntry2 = this.getFromUrl("http://cts.nlm.nih.gov/fhir");
        const resource = matchingEntry2.resource as R4.IValueSet;
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
      }
      else {
        const resource = matchingEntry.resource as R4.IValueSet;
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
      }
    });
    return map;
  }

  async getFromUrl(url: string): Promise<R4.IBundle> {
    const response = await axios.get(url);
    return response.data;
  }
}
