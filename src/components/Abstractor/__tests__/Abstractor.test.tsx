import React from 'react';
import { render } from '@testing-library/react';
import Abstractor, { Props } from '../Abstractor';

const defaultProps: Props = {
  patientData: {
    resourceType: 'Bundle',
    entry: []
  },
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
