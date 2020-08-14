import React from 'react';
import { R4 } from '@ahryman40k/ts-fhir-types';

const Questionnaire = ({ questionnaire }: { questionnaire: R4.IQuestionnaire }) => {
  // TODO: Use the questionnaire form viewer library to render the questionnaire
  return <p>Questionnaire ID: {questionnaire.id}</p>;
};

export default Questionnaire;
