import React, { useEffect } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import executeElm from '../../utils/cql-executor';
import { ValueSetMap } from '../../types/valueset';
//import resultsProcessing from '../../utils/results-processing';

export interface Props {
  patientData: R4.IBundle;
  library: any;
  valueSetMap: ValueSetMap;
  questionnaire: R4.IQuestionnaire;
}

const Abstractor = ({ patientData, library, valueSetMap, questionnaire }: Props) => {
  useEffect(() => {
    // TODO: Modify the answerOptions of the questionnaire to include the results from execution
    const results = executeElm(patientData!, library, valueSetMap);
    const lform = window.LForms.Util.convertFHIRQuestionnaireToLForms(questionnaire, 'R4');
    window.LForms.Util.addFormToPage(lform, 'formContainer');

    // TODO: Filter results by querying proper data from the returned FHIR resources.
    //const filteredResults = resultsProcessing(results);

    // Temporarily logging results to show the output of the CQL execution
    console.log(results);
  }, [patientData, library, valueSetMap, questionnaire]);

  return <div id="formContainer"></div>;
};

export default Abstractor;
