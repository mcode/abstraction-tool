import nock from 'nock';
import * as example_questionnaire from '../Questionnaires/sample_questionnaire.json';
import { QuestionnaireLoader } from '../src/QuestionnaireLoader';
// TODO: Add tests for QuestionnaireLoader class functions

const MOCK_URL = 'http://example.com';
const questionnaire = new QuestionnaireLoader();

test('questionnaire form yielding a questionnaire form result', async () => {
  nock(MOCK_URL).get('/').reply(200, example_questionnaire);

  const actualQuestionnaire = await questionnaire.getFromUrl(MOCK_URL);

  expect(actualQuestionnaire).toEqual(example_questionnaire);
});
