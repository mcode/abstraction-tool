import { R4 } from '@ahryman40k/ts-fhir-types';
import * as fs from 'fs';
import axios from 'axios';

export class QuestionnaireLoader {
  getFromFile(filePath: string): R4.IQuestionnaire {
    //accessing questionnaire folder for questionnaire specified by input
    const json = fs.readFileSync(filePath, 'utf8');
    const obj = JSON.parse(json);

    if (!this.isValidQuestionnaire(obj)) {
      throw new Error(`${filePath} is not a valid FHIR Questionnaire`);
    }

    return obj as R4.IQuestionnaire;
  }

  async getFromUrl(url: string): Promise<R4.IQuestionnaire> {
    // use axios to send GET request and return response data
    const response = await axios.get(url);

    if (!this.isValidQuestionnaire(response.data)) {
      throw new Error(`${url} did not provide a valid FHIR Questionnaire`);
    }

    return response.data as R4.IQuestionnaire;
  }

  isValidQuestionnaire(obj: any): boolean {
    const validQuestionnaire = R4.RTTI_Questionnaire.decode(obj);
    // Right = valid object
    return validQuestionnaire.isRight();
  }
}
