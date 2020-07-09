import nock from 'nock';
import samplecql from './fixtures/sample-library-text-cql.json';
import { LibraryLoader } from '../loaders/libraryLoader';
import sampleelm from './fixtures/sample-library-elm.json';
import { R4 } from '@ahryman40k/ts-fhir-types';


//Test for Library class function checkElm
const MOCK_URL = 'http://example.com/cql/translator';
// const MOCK_CQL = `
// 'library example version '0.0.1'
// using FHIR version '4.0.0'
// codesystem "LOINC": 'http://loinc.org'
// valueset "Cancer Disease Status Evidence Type Value Set": 'mcode-cancer-disease-status-evidence-type-vs'
// code "CancerDiseaseStatus Code": '88040-1' from "LOINC"
// define "CancerDiseaseStatus":
//     [Observation: "CancerDiseaseStatus Code"]`;

//library_cql = <R4.ILibrary> (JSON.parse(fs.readFileSync('./fixtures/sample-library-text-cql.json', 'utf8')));
const library_cql = <R4.ILibrary> samplecql;
const LibraryLoader_cql = new LibraryLoader(library_cql);

const library_elm = <R4.ILibrary> sampleelm;
const LibraryLoader_elm = new LibraryLoader(library_elm);

test('correctly parse the cql into elm through translation service', async () => {
  nock(MOCK_URL).get('/').reply(200, sampleelm);

  const actualElm = await LibraryLoader_cql.checkELM();

  expect(actualElm).toEqual(sampleelm);
});

//Test for QuestionnaireLoader class function getFromFile
test('correctly obtain the elm item', async () => {
  const actualElm = LibraryLoader_elm.checkELM();

  expect(actualElm).toEqual(sampleelm);
});