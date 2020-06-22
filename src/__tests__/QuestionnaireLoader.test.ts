import nock from 'nock';
import sampleQuestionnaire from './fixtures/sample-questionnaire.json';
import { QuestionnaireLoader } from '../QuestionnaireLoader';

//Test for QuestionnaireLoader class function getFromUrl
const MOCK_URL = 'http://example.com';
const questionnaire = new QuestionnaireLoader();

test('questionnaire form yielding a questionnaire form result', async () => {
  nock(MOCK_URL).get('/').reply(200, sampleQuestionnaire);

  const actualQuestionnaire = await questionnaire.getFromUrl(MOCK_URL);

  expect(actualQuestionnaire).toEqual(sampleQuestionnaire);
});