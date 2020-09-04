import React, { useEffect /*, useState */ } from 'react';
import axios from 'axios';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { usePatient } from '../PatientProvider';
import { QuestionnaireLoader } from '../../loaders/QuestionnaireLoader';
import { LibraryLoader } from '../../loaders/libraryLoader';
import executeElm from '../../utils/cql-executor';
import { ValueSetLoader } from '../../loaders/ValueSetLoader';
import resultsProcessing from '../../utils/results-processing';

//const defaultQuestionnaire: R4.IQuestionnaire = {
//resourceType: 'Questionnaire',
//status: R4.QuestionnaireStatusKind._draft
//};

const Abstractor = () => {
  //const [questionnaire, setQuestionnaire] = useState(defaultQuestionnaire);
  //const [executionResults, setExecutionResults] = useState();
  const { patientData } = usePatient();

  useEffect(() => {
    async function load() {
      // Load Questionnaire
      const questionnaireLoader = new QuestionnaireLoader();
      const url = './static/mcode-questionnaire.json';
      try {
        const questionnaireResource = await questionnaireLoader.getFromUrl(url);
        const lform = window.LForms.Util.convertFHIRQuestionnaireToLForms(questionnaireResource, 'R4');
        window.LForms.Util.addFormToPage(lform, 'formContainer');
        //setQuestionnaire(questionnaireResource);

        // Get FHIR Library
        const extension = (questionnaireResource as R4.IQuestionnaire).extension?.find(
          e => e.url === 'http://hl7.org/fhir/StructureDefinition/cqf-library'
        );

        if (extension && extension.valueCanonical) {
          const response = await axios.get(extension.valueCanonical);
          const fhirLibrary = response.data as R4.ILibrary;
          const library = await new LibraryLoader(fhirLibrary).fetchELM();

          const vsResponse = await axios.get('./static/mcode-valuesets.json');
          const valueSetBundle = vsResponse.data as R4.IBundle;
          const valueSetLoader = new ValueSetLoader(fhirLibrary, valueSetBundle);
          const valueSetMap = await valueSetLoader.seedValueSets();

          // TODO: Modify the answerOptions of the questionnaire to include the results from execution
          const results = executeElm(patientData!, library, valueSetMap);
          //console.log(results);

          // TODO: Filter results by querying proper data from the returned FHIR resources.
          const filteredResults = resultsProcessing(results);
          console.log(filteredResults)

          //setExecutionResults(results);
        }
      } catch (e) {
        console.error(`Error loading questionnaire data: ${e.message}`);
      }
    }

    if (patientData) {
      load();
    }
  }, [patientData]);
  return <div id="formContainer"></div>;
};

export default Abstractor;
