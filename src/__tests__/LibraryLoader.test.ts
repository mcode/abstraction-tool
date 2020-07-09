import nock from 'nock';
import library_with_cql from './fixtures/sample-library-text-cql.json';
import { LibraryLoader } from '../loaders/libraryLoader';
import library_with_elm from './fixtures/sample-library-elm.json';
import { R4 } from '@ahryman40k/ts-fhir-types';
import sampleelm from './fixtures/sample_known_elm.json';
import { elmServiceUrl } from '../config.json';

//Test for Library class function checkElm
const library_cql = <R4.ILibrary> library_with_cql;
const LibraryLoader_cql = new LibraryLoader(library_cql);

const library_elm = <R4.ILibrary> library_with_elm;
const LibraryLoader_elm = new LibraryLoader(library_elm);

test('correctly parse the cql into elm through translation service', async () => {
  nock(elmServiceUrl).post('/').reply(200, sampleelm);

  const actualElm = await LibraryLoader_cql.checkELM();

  expect(actualElm).toEqual(sampleelm);
});

//Test for LibraryLoader class with the elm already in the data field
test('correctly obtain the elm item', async () => {
  const actualElm = await LibraryLoader_elm.checkELM();

  expect(actualElm).toEqual(sampleelm);
});