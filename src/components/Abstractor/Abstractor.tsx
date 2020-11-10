import React, { useEffect, useState } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import executeElm from '../../utils/cql-executor';
import questionnaireUpdater from '../../utils/results-processing';
import { ValueSetMap } from '../../types/valueset';

export interface Props {
  patientData: R4.IBundle;
  library: any;
  valueSetMap: ValueSetMap;
  questionnaire: R4.IQuestionnaire;
}

const Abstractor = ({ patientData, library, valueSetMap, questionnaire }: Props) => {
  const [responseGenerated, setResponseGenerated] = useState(
     {  
      message: false,
      count: 0
    }
  );

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
    // Generate QuestionnaireResponse
    const qr = window.LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4');
    const lformer = window.LForms.Util.mergeFHIRDataIntoLForms('QuestionnaireResponse', patientData, qr, 'R4');

    console.log(qr);
    console.log("this is lformer " + lformer)
    // Signify to user that QuestionnaireResponse has been generated
    let answerCount = 0;
    if (qr.item) {
      answerCount = qr.item.length;
    }
    setResponseGenerated(responseGenerated => ({...responseGenerated,  message: true, count: answerCount}) );
  }
  
  return (
    <div>
      <div id="formContainer"> </div>
      <button onClick ={() => generateQR()}>Generate Questionnaire Response</button> 
      { responseGenerated && <p>Questionnaire Response has been generated and has been logged to the console!</p>}
    </div>
  );
};

export default Abstractor;
