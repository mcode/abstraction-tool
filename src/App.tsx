import React from 'react';
import axios from 'axios';
import { R4 } from '@ahryman40k/ts-fhir-types';
import { isRight } from 'fp-ts/Either';
import { PatientContext } from './components/PatientProvider';
import Abstractor from './components/Abstractor';
import ErrorBoundary from './components/ErrorBoundary';
import { QuestionnaireLoader } from './loaders/QuestionnaireLoader';
import { LibraryLoader } from './loaders/libraryLoader';
import { ValueSetLoader } from './loaders/ValueSetLoader';
import { ValueSetMap } from './types/valueset';
import ErrorDetails from './components/ErrorDetails';

const defaultQuestionnaire: R4.IQuestionnaire = {
  resourceType: 'Questionnaire',
  status: R4.QuestionnaireStatusKind._draft,
  item: []
};

interface AppState {
  questionnaire: R4.IQuestionnaire;
  library: any;
  valueSetMap: ValueSetMap | null;
  hasError: boolean;
  error: Error | null;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      questionnaire: defaultQuestionnaire,
      library: null,
      valueSetMap: null,
      hasError: false,
      error: null
    };
  }

  async componentDidMount() {
    // Load Questionnaire
    const questionnaireLoader = new QuestionnaireLoader();
    const url = './static/mcode-questionnaire.json';
    const questionnaireResource = await questionnaireLoader.getFromUrl(url);

    // Get FHIR Library
    const extension = (questionnaireResource as R4.IQuestionnaire).extension?.find(
      e => e.url === 'http://hl7.org/fhir/StructureDefinition/cqf-library'
    );

    if (!extension || !extension.valueCanonical) {
      this.setState({
        hasError: true,
        error: new Error(
          'Provided questionnaire does not contain a proper extension for "http://hl7.org/fhir/StructureDefinition/cqf-library"'
        )
      });
    }

    const response = await axios.get(extension.valueCanonical);
    const fhirLibrary = response.data as R4.ILibrary;

    if (!isRight(R4.RTTI_Library.decode(fhirLibrary))) {
      this.setState({
        hasError: true,
        error: new Error(`${extension.valueCanonical} did not provide a valid FHIR library`)
      });
    }

    const library = await new LibraryLoader(fhirLibrary).fetchELM();
    const vsResponse = await axios.get('./static/mcode-valuesets.json');
    const valueSetBundle = vsResponse.data as R4.IBundle;
    const valueSetLoader = new ValueSetLoader(fhirLibrary, valueSetBundle);
    const valueSetMap = await valueSetLoader.seedValueSets();

    this.setState({
      questionnaire: questionnaireResource,
      library,
      valueSetMap
    });
  }

  render() {
    const { questionnaire, library, valueSetMap, hasError, error } = this.state;
    if (hasError) {
      return <ErrorDetails error={error} errorInfo={null} />;
    }

    if (library && valueSetMap) {
      return (
        <PatientContext.Consumer>
          {value =>
            value.patientData !== null ? (
              <ErrorBoundary>
                <Abstractor
                  patientData={value.patientData}
                  questionnaire={questionnaire}
                  library={library}
                  valueSetMap={valueSetMap}
                />
              </ErrorBoundary>
            ) : (
              <p>Loading...</p>
            )
          }
        </PatientContext.Consumer>
      );
    }

    return <p>Loading...</p>;
  }
}

export default App;
