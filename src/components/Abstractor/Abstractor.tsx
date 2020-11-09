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
interface ResponseObject {
  isGenerated: boolean,
  count: number
}

const Abstractor = ({ patientData, library, valueSetMap, questionnaire }: Props) => {
  const [responseGenerated, setResponseGenerated] = useState<ResponseObject> ( 
    {
      isGenerated: false,
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
    console.log(qr);
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
      {responseGenerated.isGenerated && <p>Questionnaire Response has been generated with {responseGenerated.count} answer(s) and has been logged to the console!</p>}
    </div>
  );
};

export default Abstractor;
