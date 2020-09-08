export default function resultsProcessing(cqlResults: any): any {
  // TODO: Process FHIR resources returned from CQL Execution

  // Get each nonempty result
  const patientResults = cqlResults.patientResults;
  const patientID = Object.keys(patientResults)[0];
  const igResources = cqlResults.patientResults[patientID];


  for (let key in igResources) {
    let resource = igResources[key];
    //console.log(resource);
    if (resource.length > 0){

      console.log(key);
      console.log(resource);

      // Also take in a questionnaire resource
      

    }
  }

  // Get each nonempty result
  // Get name of expression
  // Match with linkID of questionnaire
  return igResources;
}
