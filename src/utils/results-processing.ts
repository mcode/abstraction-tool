import { R4 } from '@ahryman40k/ts-fhir-types';

interface CandidateExpression {
  url: string;
  valueExpression: {
    expression: string;
    language: string;
  };
};

// Filter results by querying proper data from the returned FHIR resources.
// Modify the answerOptions of the questionnaire to include the results from execution
export default function questionnaireUpdater(
  cqlResults: any,
  questionnaire: R4.IQuestionnaire,
  patientId: string
): R4.IQuestionnaire {
  // Object Containing Questionnaire Items
  let questionnaireItems = questionnaire.item;
  //console.log(questionnaire);
  //console.log(cqlResults);
  if (questionnaireItems !== undefined) {
    // Get Non-Empty Patient Results
    const igResources = cqlResults.patientResults[patientId];
    for (let key in igResources) {
      let resourceList = igResources[key];
      if (resourceList.length > 0) {
        // Find corresponding quesionnaire resource
        //console.log(questionnaireItems);

        const matchingResource = questionnaireItems.find( (element:R4.IQuestionnaire_Item) => getExpressionName(element) === key) as R4.IQuestionnaire_Item;
        console.log(matchingResource);
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

function getExpressionName(item: R4.IQuestionnaire_Item): string | undefined {

  if (item.extension){
    const candidateExpression = item.extension.find( (ext: R4.IExtension) => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-candidateExpression') as R4.IExtension;
    if ( (candidateExpression.valueExpression as R4.IExpression) && (candidateExpression.valueExpression?.expression as) ){
      //if (candidateExpression.valueExpression.expression)
      const valueExpressionArray = candidateExpression.valueExpression.expression.split(".");
      const expressionName = valueExpressionArray[valueExpressionArray.length - 1];
      console.log(expressionName);
      return expressionName;
    }
  }
}
