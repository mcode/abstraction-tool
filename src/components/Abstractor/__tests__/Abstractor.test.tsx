import React from 'react';
import { render } from '@testing-library/react';
import Abstractor from '../Abstractor';

test('renders Abstractor', () => {
  global.LForms = {
    Util: {
      convertFHIRQuestionnaireToLForms: jest.fn(),
      addFormToPage: jest.fn()
    }
  };
  render(<Abstractor />);
});
