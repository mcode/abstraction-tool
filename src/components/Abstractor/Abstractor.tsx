import React, { useEffect } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import executeElm from '../../utils/cql-executor';
import questionnaireUpdater from '../../utils/results-processing';
import { ValueSetMap } from '../../types/valueset';
window.LForms = require('lforms');
require('lforms/app/scripts/fhir/R4/fhirRequire');

export interface Props {
  patientData: R4.IBundle;
  library: any;
  valueSetMap: ValueSetMap;
  questionnaire: R4.IQuestionnaire;
}

const Abstractor = ({ patientData, library, valueSetMap, questionnaire }: Props) => {
  useEffect(() => {
    const results = executeElm(patientData, library, valueSetMap);

    try {
      // Get Patient ID
      const patientResource = patientData.entry!.find(
        (bundleEntry: R4.IBundle_Entry) => bundleEntry.resource!.resourceType === 'Patient'
      ) as R4.IBundle_Entry;
      const patientID = patientResource.resource!.id as string;

      const updatedQuestionnaire = questionnaireUpdater(results, questionnaire, patientID);
      // Temporary console log to show questionnaire with answer options
      console.log(updatedQuestionnaire);

      const lform = window.LForms.Util.convertFHIRQuestionnaireToLForms(updatedQuestionnaire, 'R4');
      console.log(lform);
      window.LForms.Util.addFormToPage(lform, 'formContainer');

    } catch (e) {
      console.error(`Error finding patient resource within bundle: ${e.message}`);
    }
  }, [patientData, library, valueSetMap, questionnaire]);

  const generateQR = () => {
    //Generate questionnaireResponse
    const qr = window.LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4');
    console.log(qr);

    // Signify to user that questionnaireResponse has been generated
    const response: HTMLElement | null = document.getElementById("responseGenerated");
    if (response){
      response!.innerHTML = "Questionnaire Response has been generated and logged to the console!";
    }
  }
  
  return (
    <div>
      <div id="formContainer"> </div>
      <button onClick ={() => generateQR()}>Generate Questionnaire Response</button> 
      <p id="responseGenerated"></p>
    </div>
  );
};

export default Abstractor;
