import { R4 } from '@ahryman40k/ts-fhir-types';
import { isRight } from 'fp-ts/Either';

export enum Primitives {
  STRING = 'valueString',
  DATE = 'valueDate',
  DATETIME = 'valueTime',
  TIME = 'valueTime',
  INT = 'valueInteger'
}

const ItemDataTypes = {
  [Primitives.STRING]: R4.Questionnaire_ItemTypeKind._string,
  [Primitives.INT]: R4.Questionnaire_ItemTypeKind._integer,
  [Primitives.DATE]: R4.Questionnaire_ItemTypeKind._date,
  [Primitives.DATETIME]: R4.Questionnaire_ItemTypeKind._dateTime,
  [Primitives.TIME]: R4.Questionnaire_ItemTypeKind._time
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

  if (questionnaireItems !== undefined) {
    // Get Non-Empty Patient Results
    const igResources = cqlResults.patientResults[patientId];
    for (let key in igResources) {
      let cqlResult = igResources[key];
      if ((Array.isArray(cqlResult) && cqlResult.length > 0) || (!Array.isArray(cqlResult) && cqlResult)) {
        // Find corresponding quesionnaire resource
        const matchingResource = questionnaireItems.find(
          element => getExpressionName(element) === key
        ) as R4.IQuestionnaire_Item;

        if (!matchingResource) {
          throw new Error(`Could not find questionnaire item with expressionName ${key}`);
        }

        const questionnaireItemIndex = questionnaireItems.indexOf(matchingResource);

        // Add answerOption element to questionnaire item
        let newAnswerOptions: R4.IQuestionnaire_AnswerOption[];
        if (isPrimitive(cqlResult)) {
          const t = getPrimitiveType(cqlResult);
          matchingResource.initial = [createPrimitiveInitialValue(t, cqlResult)];
          matchingResource.type = ItemDataTypes[t];
        } else {
          if (Array.isArray(cqlResult)) {
            newAnswerOptions = cqlResult.map((r: any) => createAnswerOption(r, key));
          } else {
            newAnswerOptions = [createAnswerOption(cqlResult, key)];
          }
          if (matchingResource.answerOption === undefined || matchingResource.answerOption.length === 0) {
            matchingResource.answerOption = newAnswerOptions;
          } else {
            matchingResource.answerOption = matchingResource.answerOption.concat(newAnswerOptions);
          }
        }
        questionnaireItems[questionnaireItemIndex] = matchingResource;
      }
    }
  }

  // Update questionnaire
  return questionnaire;
}

export function createAnswerOption(cqlResult: any, itemName?: string): R4.IQuestionnaire_AnswerOption {
  if (isRight(R4.RTTI_ResourceList.decode(cqlResult._json))) {
    return createValueReferenceAnswerOption(cqlResult, cqlResult._json as R4.IResourceList);
  } else if (isRight(R4.RTTI_CodeableConcept.decode(cqlResult._json))) {
    return createValueCodingAnswerOptionCodeableConcept(cqlResult._json as R4.ICodeableConcept);
  } else if (Array.isArray(cqlResult) && isRight(R4.RTTI_Coding.decode(cqlResult[0]._json))) {
    // Codings will come in as arrays
    return createValueCodingAnswerOptionCoding(cqlResult[0]._json as R4.ICoding);
  } else {
    throw new Error(`Unable to map cql result for ${itemName} to Questionnaire answerOption`);
  }
}

export function isPrimitive(result: any): boolean {
  return (
    typeof result === 'string' ||
    result.isDate ||
    result.isDateTime ||
    isRight(R4.RTTI_time.decode(result._json)) ||
    isRight(R4.RTTI_integer.decode(result))
  );
}

export function getPrimitiveType(result: any): 'valueDate' | 'valueTime' | 'valueInteger' | 'valueString' {
  if (typeof result === 'string') {
    return Primitives.STRING;
  } else if (result.isDate) {
    return Primitives.DATE;
  } else if (result.isDateTime) {
    return Primitives.DATETIME;
  } else if (isRight(R4.RTTI_time.decode(result._json))) {
    return Primitives.TIME;
  } else if (isRight(R4.RTTI_integer.decode(result))) {
    return Primitives.INT;
  } else {
    throw new Error(`${result} was detected as primitive but could not be processed`);
  }
}

export function createPrimitiveInitialValue(
  key: 'valueDate' | 'valueTime' | 'valueInteger' | 'valueString',
  cqlResult: Date | number | string
): R4.IQuestionnaire_Initial {
  return {
    [key]: key === Primitives.DATE || key === Primitives.DATETIME ? cqlResult.toString() : cqlResult
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
  const resourceType = fhirObject.resourceType as string;
  const referenceValue = `${resourceType}/${fhirObject.id}`;
  const displayValue = getDisplayValue(cqlResult, resourceType);
  // Format answer option
  const referenceObject = {
    valueReference: {
      reference: referenceValue,
      display: displayValue ? displayValue : referenceValue
    }
  };
  return referenceObject;
}

function getExpressionName(item: R4.IQuestionnaire_Item): string | undefined {
  if (item.extension) {
    const candidateExpression = item.extension.find(
      ext => ext.url === 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-candidateExpression'
    ) as R4.IExtension;
    if (candidateExpression.valueExpression?.expression) {
      const expressionArray = candidateExpression.valueExpression.expression.split('.');
      const expressionName = expressionArray[expressionArray.length - 1];
      return expressionName;
    }
  }
  return undefined;
}

function getDisplayValue(fhirResource: any, resourceType: string): string | undefined {
  let attribute: string;
  // Determine which Codeable Concept attribute to query based upon incoming resource type
  switch (resourceType) {
    case 'Specimen':
      attribute = 'type';
      break;
    case 'MedicationStatement':
      attribute = 'medicationCodeableConcept';
      break;
    default:
      attribute = 'code';
  }
  let display: string | undefined;
  if (fhirResource[attribute]?.text?.value) display = fhirResource[attribute].text.value;
  else display = fhirResource[attribute]?.coding[0]?.display?.value;
  return display;
}
