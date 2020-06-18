import { R4 } from '@ahryman40k/ts-fhir-types';
import * as fs from 'fs';
//import * as util from 'util'
import { IQuestionnaire } from '@ahryman40k/ts-fhir-types/lib/R4';
import axios from 'axios';


export class QuestionnaireLoader {
  getFromFile(filePath: string): R4.IQuestionnaire {
    // use fs to read in file content as JSON
    let obj = {} as IQuestionnaire;
    const json = fs.readFileSync(`../Questionnaires/${filePath}`, 'utf8');
    if (json) {
      obj = JSON.parse(json);
      console.log(obj);
      return obj;
    } else {
      console.log('This is null or undefined');
      return obj;
    }
  }

  getFromUrl(url: string): R4.IQuestionnaire {
    let obj = {} as IQuestionnaire;
    // use axios to send GET request and return response data
    axios.get(url)
    .then(function(response) {
      console.log(response.status);
      if (response.status == 200) {
        obj = response.data;
        console.log(obj);
      }
    })
    .catch( function (error) {
      if (error.response) {
        console.log('The error status: ' + error.response.status);
        console.log(error.response.headers);
        return obj;
      }
    });
    return obj;
  }
}


//
//let QuestionnaireLoader1 = new QuestionnaireLoader();
//QuestionnaireLoader1.getFromFile('sample_questionnaire.json');
//QuestionnaireLoader1.getFromUrl('http://hapi.fhir.org/baseR4/Questionnaire/1221728');
