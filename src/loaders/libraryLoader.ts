import { R4 } from '@ahryman40k/ts-fhir-types';
import { Base64 } from 'js-base64';
//import * as fs from 'fs';
import { convertBasicCQL } from '../helpers/cql-to-elm';


export class LibraryLoader {
  library: R4.ILibrary;

  constructor(thelibrary: R4.ILibrary) {
    this.library = thelibrary;
  }

  async checkELM(): Promise<any> {
    //getting the elm and decoding the data components
    const contentInfoElm = this.library.content?.find(x => x.contentType === 'application/elm+json');
    const contentInfoTranslate = this.library.content?.find(x => x.contentType === 'text/cql');
    if (contentInfoElm && contentInfoElm.data) {
      return JSON.parse(Base64.decode(contentInfoElm.data));
     } else if (contentInfoTranslate && contentInfoTranslate.data) {
       //this is running the cql through a translation service and returning the elm if it isn't provided
        const decoded = Base64.decode(contentInfoTranslate.data);
        return await convertBasicCQL(decoded);
    }
  }
}