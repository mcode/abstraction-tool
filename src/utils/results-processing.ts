import { R4 } from "@ahryman40k/ts-fhir-types";

export default function questionnaireUpdater(cqlResults: any, questionnaire: R4.IQuestionnaire): any {
  // TODO: Process FHIR resources returned from CQL Execution

  let questionnaireItems: any = questionnaire.item;
  console.log((questionnaire));

  // Get each nonempty result
  const patientResults = cqlResults.patientResults;
  //console.log(patientResults);
  const patientID = Object.keys(patientResults)[0];
  const igResources = cqlResults.patientResults[patientID];

  //console.log(igResources)

  for (let key in igResources) {
    let resource = igResources[key];
    //console.log(resource);
    if (resource.length > 0){

      //console.log(key);
      //console.log(resource);

      for (let questionnaireItem in questionnaireItems) {
        let possibleMatch = questionnaireItems[questionnaireItem]["linkId"];
        if (possibleMatch === key) {
          console.log(possibleMatch);
          console.log(questionnaireItems[questionnaireItem].answerOption);
          if (questionnaireItems[questionnaireItem].answerOption) {
            questionnaireItems[questionnaireItem].answerOption.push(resource);
          }
          else {
            questionnaireItems[questionnaireItem].answerOption = resource;
          }
        }
      }
      console.log(questionnaireItems);

      // Also take in a questionnaire resource
      
    }
  }


  // Get each nonempty result
  // Get name of expression
  // Match with linkID of questionnaire
  return igResources;
}
