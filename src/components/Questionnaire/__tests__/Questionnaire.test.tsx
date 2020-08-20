import React from 'react';
import { render } from '@testing-library/react';
import { R4 } from '@ahryman40k/ts-fhir-types';
import Questionnaire from '../Questionnaire';

const questionnaire: R4.IQuestionnaire = {
  resourceType: 'Questionnaire',
  id: 'example-questionnaire'
};

test('renders Abstractor', () => {
  const { getByText } = render(<Questionnaire questionnaire={questionnaire} />);
  expect(getByText(new RegExp(questionnaire.id!, 'i'))).toBeInTheDocument();
});
