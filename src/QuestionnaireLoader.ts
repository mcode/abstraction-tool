import { R4 } from '@ahryman40k/ts-fhir-types';

export class QuestionnaireLoader {
  getFromFile(filePath: string): R4.IQuestionnaire {
    // use fs to read in file content as JSON
  }

  getFromUrl(url: string): R4.IQuestionnaire {
    // use axios to send GET request and return response data
  }
}
