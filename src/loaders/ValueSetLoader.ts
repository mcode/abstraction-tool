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
    const queries = valueSetUrls.map(async url => {
      const matchingEntry = this.contextBundle.entry?.find(e => e.fullUrl === url);

      if (matchingEntry) {
        if (!this.isValidValueSet(matchingEntry.resource)) {
          throw new Error(`${matchingEntry.fullUrl} is not a valid FHIR ValueSet`);
        }

        return matchingEntry.resource as R4.IValueSet;
      } else {
        return this.getFromUrl(url!);
      }
    });

    const resources = await Promise.all(queries);

    resources.forEach(resource => {
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

    if (!this.isValidValueSet(response.data)) {
      throw new Error(`Data from ${url} is not a valid FHIR ValueSet`);
    }

    return response.data;
  }

  isValidValueSet(obj: any): boolean {
    // mCODE ValueSets are failing validation because of description markdown
    // Ignoring this for now
    if (obj.description) delete obj.description;

    const validValueSet = R4.RTTI_ValueSet.decode(obj);
    // Right = valid object
    return validValueSet.isRight();
  }
}
