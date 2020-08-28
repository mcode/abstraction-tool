import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { usePatient } from './components/PatientProvider';
import Abstractor from './components/Abstractor';
import { QuestionnaireLoader } from './loaders/QuestionnaireLoader';
import { LibraryLoader } from './loaders/libraryLoader';
import { ValueSetLoader } from './loaders/ValueSetLoader';
//import resultsProcessing from '../../utils/results-processing';

const App = () => {
  const [questionnaire, setQuestionnaire] = useState();
  const [library, setLibrary] = useState();
  const [valueSetMap, setValueSetMap] = useState();
  const { patientData } = usePatient();

  useEffect(() => {
    async function load() {
      // Load Questionnaire
      const questionnaireLoader = new QuestionnaireLoader();
      const url = './static/mcode-questionnaire.json';
      try {
        const questionnaireResource = await questionnaireLoader.getFromUrl(url);
        setQuestionnaire(questionnaireResource);

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
          const valueSetMap = valueSetLoader.seedValueSets();

          setLibrary(library);
          setValueSetMap(valueSetMap);
        }
      } catch (e) {
        console.error(`Error loading questionnaire data: ${e.message}`);
      }
    }

    if (patientData) {
      load();
    }
  }, [patientData]);

  return patientData && questionnaire && library && valueSetMap ? (
    <Abstractor patientData={patientData} questionnaire={questionnaire} library={library} valueSetMap={valueSetMap} />
  ) : (
    <p> Loading... </p>
  );
};

export default App;
