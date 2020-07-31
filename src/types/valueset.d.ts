import { R4 } from "@ahryman40k/ts-fhir-types";

export interface ValueSetMap {
  [key: string]: {
    [key: string]: R4.ICoding[];
  };
}
