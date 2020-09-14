import { R4 } from '@ahryman40k/ts-fhir-types';

// Filter results by querying proper data from the returned FHIR resources.
// Modify the answerOptions of the questionnaire to include the results from execution
export default function questionnaireUpdater(cqlResults: any, questionnaire: R4.IQuestionnaire): R4.IQuestionnaire {
  // Object Containing Questionnaire Items
  let questionnaireItems: any = questionnaire.item;

  // Get Non-Empty Patient Results
  const patientResults = cqlResults.patientResults;
  const patientID = Object.keys(patientResults)[0];
  const igResources = cqlResults.patientResults[patientID];

  for (let key in igResources) {
    let resourceList = igResources[key];
    if (resourceList.length > 0) {
      // Accomodate for the return of multiple resources (for now this will just iterate over 1 resource)
      for (let fhirResource in resourceList) {
        // Match the FHIR Object to the Correspinding Questionnaire LinkID
        for (let r in questionnaireItems) {
          let possibleMatch = questionnaireItems[r]['linkId'];
          if (possibleMatch === key) {
            // Add as an answerOption for the Questionnaire item
            const answerOption = createAnswerOption(resourceList[fhirResource]);

            if (!questionnaireItems[r].answerOption) {
              questionnaireItems[r].answerOption = [answerOption];
            } else {
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
    let referenceLocation = fhirObject._json.resourceType + '/' + fhirObject.id.value;
    // Format answer option
    const referenceObject = {
      // TODO: Create support for valueReferences in Lforms

      // valueReference: {
      //   reference: referenceLocation,
      //   display: fhirObject.code.coding[0].display.value
      // }

      // Formatting the valueReference object like this for now since this is the only way to preserve the reference in the QuesitonniareResponse without adding full lform support for valueReferences
      valueReference: referenceLocation
    };
    return referenceObject;
  }
}
