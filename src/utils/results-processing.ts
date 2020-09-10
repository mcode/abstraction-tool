import { R4 } from "@ahryman40k/ts-fhir-types";

export default function questionnaireUpdater(cqlResults: any, questionnaire: R4.IQuestionnaire): any {

  // Object Containing Questionnaire Items 
  let questionnaireItems: any = questionnaire.item;
  console.log((questionnaireItems));

  // Get Non-Empty Patient Results
  const patientResults = cqlResults.patientResults;
  const patientID = Object.keys(patientResults)[0];
  const igResources = cqlResults.patientResults[patientID];

  for (let key in igResources) {
    let resourceList = igResources[key];
    if (resourceList.length > 0) {

      // Accomodate for the return of multiple resources (For now this will just iterate over 1 resource)
      for (let fhirResource in resourceList) {

        // Match the FHIR Object to the Correspinding Questionnaire LinkID
        for (let r in questionnaireItems) {
          let possibleMatch = questionnaireItems[r]["linkId"];

          if (possibleMatch === key) {
            console.log(possibleMatch);

            const answerOption = createAnswerOption(resourceList[fhirResource]);

            if (!questionnaireItems[r].answerOption) {
              //console.log([answerOption.valueReference.reference]);
              questionnaireItems[r].answerOption = [answerOption];
            }
            else {
              questionnaireItems[r].answerOption.push(answerOption);
            }
          }
        }
      }
    }
  }
  questionnaire.item = questionnaireItems;
  return questionnaire;

  function createAnswerOption(fhirObject: any) {
    let referenceLocation = ( fhirObject._json.resourceType + "/" + fhirObject.id.value );
    // Format answer option
    const referenceObject = {
      valueReference: {
        reference: referenceLocation,
        display: fhirObject.code.coding[0].display.value
      }
    };
    return referenceObject;
  }

}
