import React, { useEffect, useState } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import executeElm from '../../utils/cql-executor';
import questionnaireUpdater from '../../utils/results-processing';
import { ValueSetMap } from '../../types/valueset';
import ExportDialog from '../ExportDialog/ExportDialog';

export interface Props {
  patientData: R4.IBundle;
  library: any;
  valueSetMap: ValueSetMap;
  questionnaire: R4.IQuestionnaire;
}

enum ContentType {
  HL7 = 'hl7',
  QR = 'qr'
}

const Abstractor = ({ patientData, library, valueSetMap, questionnaire }: Props) => {

  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string>();
  
  const handleClickOpen = (modalContent: string) => {
    setOpen(true);
    
    let response = '';
    if (modalContent === ContentType.HL7) {
      response = generateHL7Message();
    } else if (modalContent === ContentType.QR) {
      response = generateQR();
    };  
    setModalContent(response);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    return JSON.stringify(qr, null, 10)
  }
  
  const generateHL7Message = () => {
    const exporter = window.LForms.Util.getFormHL7Data();
    return exporter
  }
  

  return (
    <div>
      <div id="formContainer"> </div>
      <button onClick ={() => handleClickOpen('qr')}>Generate Questionnaire Response</button> 
      <button type = "button" onClick ={() => handleClickOpen('hl7')}>HL7 v2 Message</button>
      <ExportDialog open={open} close={handleClose} content={modalContent}/>
    </div>
  );
};

export default Abstractor;
