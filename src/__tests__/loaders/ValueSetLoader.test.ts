/**
 * @jest-environment node
 */
import { R4 } from '@ahryman40k/ts-fhir-types';
import { ValueSetLoader } from '../../loaders/ValueSetLoader';
import exampleLibrary from '../fixtures/sample-library.json';
import exampleBundle from '../fixtures/sample-valueset-bundle.json';
import { ValueSetMap } from '../../types/valueset';
import nock from 'nock';

const EXPECTED_MAP: ValueSetMap = {
  'example-valueset-1': {
    '1': [
      { code: 'vs1-code-1', system: 'http://example.com' },
      { code: 'vs1-code-2', system: 'http://example.com' }
    ]
  },
  'example-valueset-2': {
    '1': [
      { code: 'vs2-code-1', system: 'http://example.com' },
      { code: 'vs2-code-2', system: 'http://example.com' }
    ]
  },
  'example-valueset-3': {
    '1': [
      { code: 'vs3-code-1', system: 'http://example.com' },
      { code: 'vs3-code-2', system: 'http://example.com' }
    ]
  }
};

const MOCK_URL = 'http://example.com';

const valueSetLoader = new ValueSetLoader(<R4.ILibrary>exampleLibrary, <R4.IBundle>exampleBundle);

test('seeds ValueSets properly using bundle', () => {
  const valueSetMap = valueSetLoader.seedValueSets();
  expect(valueSetMap).toEqual(EXPECTED_MAP);
});

test('correctly query url for a valueset', async () => {
  nock(MOCK_URL).get('/').reply(200, EXPECTED_MAP);

  const actualValueSet = await valueSetLoader.getFromUrl(MOCK_URL);

  expect(actualValueSet).toEqual(EXPECTED_MAP);
});
