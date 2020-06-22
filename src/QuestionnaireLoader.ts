import { R4 } from '@ahryman40k/ts-fhir-types';
import * as fs from 'fs';
import axios from 'axios';

export class QuestionnaireLoader {
  getFromFile(filePath: string): R4.IQuestionnaire {
    //accessing questionnaire folder for questionnaire specified by input
    const json = fs.readFileSync(filePath, 'utf8');
    const obj = JSON.parse(json) as R4.IQuestionnaire;
    if (obj && obj.resourceType === 'Questionnaire') {
      return obj;
    } else {
      throw new Error('provided file is not a valid FHIR questionnaire');
    }
  }

  async getFromUrl(url: string): Promise<R4.IQuestionnaire> {
    // use axios to send GET request and return response data
    const response = await axios.get(url);
    return response.data;
  }
}
