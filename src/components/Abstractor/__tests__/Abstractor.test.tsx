import React from 'react';
import { render } from '@testing-library/react';
import Abstractor, { Props } from '../Abstractor';
import bundle from '../../../__tests__/fixtures/sample-patient-bundle.json';
import { R4 } from '@ahryman40k/ts-fhir-types';

const defaultProps: Props = {
  patientData: bundle as R4.IBundle,
  library: null,
  valueSetMap: {},
  questionnaire: {
    resourceType: 'Questionnaire',
  }
}

const globalAny: any = global;

test('renders Abstractor', () => {
  globalAny.LForms = {
    Util: {
      convertFHIRQuestionnaireToLForms: jest.fn(),
      addFormToPage: jest.fn()
    }
  };
  render(<Abstractor { ...defaultProps } />);
});
