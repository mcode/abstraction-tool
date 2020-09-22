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
      // Find corresponding quesionnaire resource
      const matchingResource = questionnaireItems.find((element: any) => element.linkId === key);
      const questionnaireItemIndex = questionnaireItems.indexOf(matchingResource);

      // Add answerOption element to questionnaire item
      const answerOptionArray = resourceList.map(createAnswerOption);
      if (!matchingResource.answerOption) {
        matchingResource.answerOption = answerOptionArray;
      } else {
        matchingResource.answerOption = matchingResource.answerOption.push.apply(
          matchingResource.answerOption,
          answerOptionArray
        );
      }
      questionnaireItems[questionnaireItemIndex] = matchingResource;
    }
  }

  // Update questionnaire
  questionnaire.item = questionnaireItems;
  return questionnaire;
}

function createAnswerOption(fhirObject: any) {
  const referenceLocation = `${fhirObject._json.resourceType}/${fhirObject.id.value}`;
  // Format answer option
  const referenceObject = {
    valueReference: {
      reference: referenceLocation,
      display: fhirObject.code.coding[0].display.value
    }
  };
  return referenceObject;
}
