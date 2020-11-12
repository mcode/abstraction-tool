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
      if ((Array.isArray(resourceList) && resourceList.length > 0) || (!Array.isArray(resourceList) && resourceList)) {
        // Find corresponding quesionnaire resource
        const matchingResource = questionnaireItems.find(element => element.linkId === key) as R4.IQuestionnaire_Item;
        const questionnaireItemIndex = questionnaireItems.indexOf(matchingResource);

        // Add answerOption element to questionnaire item
        let newAnswerOptions: R4.IQuestionnaire_AnswerOption[];
        if (Array.isArray(resourceList)) {
          newAnswerOptions = resourceList.map((r: any) => createAnswerOption(r, key));
        } else {
          newAnswerOptions = [createAnswerOption(resourceList, key)];
        }
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

export function createAnswerOption(cqlResult: any, itemName?: string): R4.IQuestionnaire_AnswerOption {
  if (R4.RTTI_ResourceList.decode(cqlResult._json).isRight()) {
    return createValueReferenceAnswerOption(cqlResult, cqlResult._json as R4.IResourceList);
  } else if (R4.RTTI_CodeableConcept.decode(cqlResult._json).isRight()) {
    return createValueCodingAnswerOptionCodeableConcept(cqlResult._json as R4.ICodeableConcept);
  } else if (Array.isArray(cqlResult) && R4.RTTI_Coding.decode(cqlResult[0]._json).isRight()) {
    // Codings will come in as arrays
    return createValueCodingAnswerOptionCoding(cqlResult[0]._json as R4.ICoding);
  } else if (typeof cqlResult === 'string') {
    return createPrimitiveAnswerOption('valueString', cqlResult);
  } else if (cqlResult.isDate) {
    return createPrimitiveAnswerOption('valueDate', (cqlResult as Date).toString());
  } else if (cqlResult.isDateTime) {
    return createPrimitiveAnswerOption('valueTime', (cqlResult as Date).toString());
  } else if (R4.RTTI_time.decode(cqlResult._json).isRight()) {
    return createPrimitiveAnswerOption('valueTime', cqlResult as Date);
  } else if (R4.RTTI_integer.decode(cqlResult).isRight()) {
    return createPrimitiveAnswerOption('valueInteger', cqlResult as number);
  } else {
    throw new Error(`Unable to map cql result for ${itemName} to Questionnaire answerOption`);
  }
}

function createPrimitiveAnswerOption(
  key: 'valueDate' | 'valueTime' | 'valueInteger' | 'valueString',
  cqlResult: Date | number | string
): R4.IQuestionnaire_AnswerOption {
  return {
    [key]: cqlResult
  };
}

function createValueCodingAnswerOptionCodeableConcept(cqlResult: R4.ICodeableConcept): R4.IQuestionnaire_AnswerOption {
  return {
    valueCoding: {
      ...(cqlResult.coding && cqlResult.coding[0])
    }
  };
}

function createValueCodingAnswerOptionCoding(cqlResult: R4.ICoding): R4.IQuestionnaire_AnswerOption {
  return {
    valueCoding: {
      ...cqlResult
    }
  };
}

function createValueReferenceAnswerOption(
  cqlResult: any,
  fhirObject: R4.IResourceList
): R4.IQuestionnaire_AnswerOption {
  const referenceLocation = `${fhirObject.resourceType}/${cqlResult.id.value}`;
  // Format answer option
  const referenceObject = {
    valueReference: {
      reference: referenceLocation,
      display: cqlResult.code.coding[0].display.value
    }
  };
  return referenceObject;
}
