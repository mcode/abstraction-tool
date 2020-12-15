import React, { useEffect, useState } from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import executeElm from '../../utils/cql-executor';
import questionnaireUpdater from '../../utils/results-processing';
import { ValueSetMap } from '../../types/valueset';
import ExportDialog from '../ExportDialog/ExportDialog';
import Button from '@material-ui/core/Button';

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
    }
    setModalContent(response);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Get Patient ID
    const patientResource = patientData.entry?.find(
      (bundleEntry: R4.IBundle_Entry) => bundleEntry.resource?.resourceType === 'Patient'
    ) as R4.IBundle_Entry;

    if (!patientResource || !patientResource.resource) {
      throw new Error('Patient data bundle does not contain a patient resource');
    }

    const patientID = patientResource.resource.id;
    if (!patientID) {
      throw new Error('Could not find property "id" on patient resource');
    }

    const results = executeElm(patientData, library, valueSetMap);
    const updatedQuestionnaire = questionnaireUpdater(results, questionnaire, patientID);
    // Temporary console log to show questionnaire with answer options
    console.log(updatedQuestionnaire);

    const lform = window.LForms.Util.convertFHIRQuestionnaireToLForms(updatedQuestionnaire, 'R4');
    console.log(lform);
    window.LForms.Util.addFormToPage(lform, 'formContainer');
  }, [patientData, library, valueSetMap, questionnaire]);

  const generateQR = () => {
    // Generate QuestionnaireResponse
    const qr = window.LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4');
    return JSON.stringify(qr, null, 2);
  };

  const generateHL7Message = () => {
    const exporter = window.LForms.Util.getFormHL7Data();
    return JSON.stringify(exporter, null, 2);
  };

  return (
    <div>
      <div id="formContainer"> </div>
      <Button
        style={{
          backgroundColor: '#4b8ac8'
        }}
        size="medium"
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen('qr')}
      >
        Generate Questionnaire Response
      </Button>
      <Button
        style={{
          backgroundColor: '#4b8ac8'
        }}
        size="medium"
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen('hl7')}
      >
        HL7 v2 Message
      </Button>
      <ExportDialog open={open} close={handleClose} content={modalContent} />
    </div>
  );
};

export default Abstractor;
