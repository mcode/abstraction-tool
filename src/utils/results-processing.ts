import { R4 } from '@ahryman40k/ts-fhir-types';

// Filter results by querying proper data from the returned FHIR resources.
// Modify the answerOptions of the questionnaire to include the results from execution
export default function questionnaireUpdater(
  cqlResults: any,
  questionnaire: R4.IQuestionnaire,
  patientId: string
): R4.IQuestionnaire {
  // Object Containing Questionnaire Items
  let questionnaireItems = questionnaire.item;

  if (questionnaireItems !== undefined) {
    // Get Non-Empty Patient Results
    const igResources = cqlResults.patientResults[patientId];
    for (let key in igResources) {
      let resourceList = igResources[key];
      console.log(resourceList);
      if (resourceList.length > 0) {
        // Find corresponding quesionnaire resource
        const matchingResource = questionnaireItems.find(element => element.linkId === key) as R4.IQuestionnaire_Item;
        const questionnaireItemIndex = questionnaireItems.indexOf(matchingResource);

        // Add answerOption element to questionnaire item
        const newAnswerOptions = resourceList.map(createAnswerOption);
        if (matchingResource.answerOption === undefined || matchingResource.answerOption.length === 0) {
          matchingResource.answerOption = newAnswerOptions;
        } else {
          matchingResource.answerOption = matchingResource.answerOption.concat(newAnswerOptions);
        }
        questionnaireItems[questionnaireItemIndex] = matchingResource;
      }
    }
  }

  // Update questionnaire
  return questionnaire;
}

function createAnswerOption(fhirObject: any): R4.IQuestionnaire_AnswerOption {
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
