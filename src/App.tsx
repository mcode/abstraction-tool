import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { usePatient } from './components/PatientProvider';
import Abstractor from './components/Abstractor';
import AppError from './components/AppError';
import { QuestionnaireLoader } from './loaders/QuestionnaireLoader';
import { LibraryLoader } from './loaders/libraryLoader';
import { ValueSetLoader } from './loaders/ValueSetLoader';
import { ValueSetMap } from './types/valueset';

const defaultQuestionnaire: R4.IQuestionnaire = {
  resourceType: 'Questionnaire',
  status: R4.QuestionnaireStatusKind._draft,
  item: []
};

const App = () => {
  const [questionnaire, setQuestionnaire] = useState(defaultQuestionnaire);
  const [library, setLibrary] = useState(null);
  const [valueSetMap, setValueSetMap] = useState<ValueSetMap | null>(null);
  const { patientData } = usePatient();

  useEffect(() => {
    async function load() {
      // Load Questionnaire
      const questionnaireLoader = new QuestionnaireLoader();
      const url = './static/mcode-questionnaire.json';
      const questionnaireResource = await questionnaireLoader.getFromUrl(url);
      setQuestionnaire(questionnaireResource);

      // Get FHIR Library
      const extension = (questionnaireResource as R4.IQuestionnaire).extension?.find(
        e => e.url === 'http://hl7.org/fhir/StructureDefinition/cqf-library'
      );

      if (!extension || !extension.valueCanonical) {
        throw new Error(
          'Provided questionnaire does not contain a proper extension for "http://hl7.org/fhir/StructureDefinition/cqf-library"'
        );
      }

      const response = await axios.get(extension.valueCanonical);
      const fhirLibrary = response.data as R4.ILibrary;

      if (!R4.RTTI_Library.decode(fhirLibrary).isRight()) {
        throw new Error(`${extension.valueCanonical} did not provide a valid FHIR library`);
      }

      const library = await new LibraryLoader(fhirLibrary).fetchELM();

      const vsResponse = await axios.get('./static/mcode-valuesets.json');
      const valueSetBundle = vsResponse.data as R4.IBundle;
      const valueSetLoader = new ValueSetLoader(fhirLibrary, valueSetBundle);
      const valueSetMap = await valueSetLoader.seedValueSets();

      setLibrary(library);
      setValueSetMap(valueSetMap);
    }
    if (patientData) {
      load();
    }
  }, [patientData]);

  return (
    <AppError>
      {patientData && questionnaire && library && valueSetMap ? (
        <Abstractor
          patientData={patientData}
          questionnaire={questionnaire}
          library={library}
          valueSetMap={valueSetMap}
        />
      ) : (
        <p> Loading... </p>
      )}
    </AppError>
  );
};

export default App;
