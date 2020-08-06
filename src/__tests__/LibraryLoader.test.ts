/**
 * @jest-environment node
 */
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

const MOCK_URL = 'http://example.com/';
const MOCK_CQL = `
library example version '0.0.1'
using FHIR version '4.0.0'
codesystem "LOINC": 'http://loinc.org'
valueset "Cancer Disease Status Evidence Type Value Set": 'mcode-cancer-disease-status-evidence-type-vs'
code "CancerDiseaseStatus Code": '88040-1' from "LOINC"
define "CancerDiseaseStatus":
    [Observation: "CancerDiseaseStatus Code"]
`;

test('correctly parse the cql into elm through translation service', async () => {
  nock(elmServiceUrl).post('/').reply(200, sampleElm);

  const actualElm = await LibraryLoaderCql.fetchELM();

  expect(actualElm).toEqual(sampleElm);
});

//Test for LibraryLoader class with the elm already in the data field
test('correctly obtain the elm item', async () => {
  const actualElm = await LibraryLoaderElm.fetchELM();

  expect(actualElm).toEqual(sampleElm);
});

//Test for LibraryLoader class with a url
test('correctly parse the cql into elm through translation service from url', async () => {
  nock(MOCK_URL).get('/').reply(200, MOCK_CQL);
  nock(elmServiceUrl).post('/').reply(200, sampleElm);

  const actualElm = await LibraryLoaderCql.fetchELM();

  expect(actualElm).toEqual(sampleElm);
});

test('correctly obtain the elm item from url', async () => {
  nock(MOCK_URL).get('/').reply(200, sampleElm);
  const actualElm = await LibraryLoaderElm.fetchELM();

  expect(actualElm).toEqual(sampleElm);
});
