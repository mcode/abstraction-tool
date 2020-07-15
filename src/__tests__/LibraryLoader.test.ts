import nock from 'nock';
import libraryWithCql from './fixtures/sample-library-text-cql.json';
import { LibraryLoader } from '../loaders/libraryLoader';
import libraryWithElm from './fixtures/sample-library-elm.json';
import { R4 } from '@ahryman40k/ts-fhir-types';
import sampleElm from './fixtures/sample_known_elm.json';
import { elmServiceUrl } from '../config.json';

//Test for Library class function checkElm
const libraryCql = <R4.ILibrary>libraryWithCql;
const LibraryLoaderCql = new LibraryLoader(libraryCql);

const libraryElm = <R4.ILibrary>libraryWithElm;
const LibraryLoaderElm = new LibraryLoader(libraryElm);

test('correctly parse the cql into elm through translation service', async () => {
  nock(elmServiceUrl).post('/').reply(200, sampleElm);

  const actualElm = await LibraryLoaderCql.checkELM();

  expect(actualElm).toEqual(sampleElm);
});

//Test for LibraryLoader class with the elm already in the data field
test('correctly obtain the elm item', async () => {
  const actualElm = await LibraryLoaderElm.checkELM();

  expect(actualElm).toEqual(sampleElm);
});
