/**
 * @jest-environment node
 */
import nock from 'nock';
import sampleQuestionnaire from '../fixtures/sample-questionnaire.json';
import { QuestionnaireLoader } from '../../loaders/QuestionnaireLoader';

//Test for QuestionnaireLoader class function getFromUrl
const MOCK_URL = 'http://example.com';
const questionnaire = new QuestionnaireLoader();
const FILE = './src/__tests__/fixtures/sample-questionnaire.json';

test('correctly query url for a questionnaire', async () => {
  nock(MOCK_URL).get('/').reply(200, sampleQuestionnaire);

  const actualQuestionnaire = await questionnaire.getFromUrl(MOCK_URL);

  expect(actualQuestionnaire).toEqual(sampleQuestionnaire);
});

//Test for QuestionnaireLoader class function getFromFile
test('correctly query file for a questionnaire', async () => {
  const actualQuestionnaire = questionnaire.getFromFile(FILE);

  expect(actualQuestionnaire).toEqual(sampleQuestionnaire);
});

test('invalid Questionnaire file should throw error', async () => {
  expect(() => {
    questionnaire.getFromFile('./src/__tests__/fixtures/sample-patient-bundle.json');
  }).toThrowError();
});

test('invalid Questionnaire from URL should throw error', async () => {
  nock(MOCK_URL).get('/').reply(200, { resourceType: 'not a questionnaire' });

  expect(questionnaire.getFromUrl(MOCK_URL)).rejects.toThrowError();
});
