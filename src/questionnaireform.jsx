export default class QuestionnaireForm extends Component {
    componentDidMount() {
        console.log(JSON.stringify(this.props.qform));
        console.log(JSON.stringify(this.state.savedResponse));
        let lform = LForms.Util.convertFHIRQuestionnaireToLForms(this.props.qform, this.props.fhirVersion);
    
        lform.templateOptions = {
          showFormHeader: false,
          showColumnHeaders: false,
          showQuestionCode: false,
          hideFormControls: true,
          showFormOptionPanelButton: true//,
          //allowHTMLInInstructions: true,
          //showCodingInstruction: true
        };
    
        if (this.state.savedResponse) {
          lform = LForms.Util.mergeFHIRDataIntoLForms("QuestionnaireResponse", this.state.savedResponse, lform, this.props.fhirVersion)
        }
    
        console.log(JSON.stringify(lform));
        LForms.Util.addFormToPage(lform, "formContainer")
      }
      getQuestionnaireResponse(status) {
        var qr = window.LForms.Util.getFormFHIRData('QuestionnaireResponse', 'R4');
        qr.status = status;
        qr.author = {
          reference:
            "Practitioner/" +
            this.props.cqlPrepoulationResults.BasicPractitionerInfoPrepopulation
              .OrderingProvider.id.value
        }
    }
}