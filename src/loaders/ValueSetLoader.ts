import { R4 } from '@ahryman40k/ts-fhir-types';
import _ from 'lodash';
import { ValueSetMap } from '../types/valueset';
import value from '*.json';

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
    console.log(valueSetIDs);
    valueSetIDs.forEach(id => {
      const matchingEntry = this.contextBundle.entry?.find(e => e.resource?.id === id);
      console.log(matchingEntry);
      if (matchingEntry) {
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
}
