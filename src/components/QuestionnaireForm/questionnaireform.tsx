import React, { Component } from "react";
import "./QuestionnaireForm.css";
 export default class QuestionnaireForm extends Component {
   constructor(props) {
     super(props);
        this.state = {
          containedResources: null,
          items: null,
          itemTypes: {},
          values: {
            "1.1": "henlo"
          },
          orderedLinks: [],
          sectionLinks: {},
          fullView: true,
          turnOffValues: [],
          useSavedResponse: false,
          savedResponse: null
        };
    }

    componentWillMount() {
      // setup
      // get all contained resources
      let partialResponse = localStorage.getItem(this.props.qform.id);
      let saved_response = false;
  
      if (partialResponse) {
        let result = confirm(
          "Found previously saved form. Do you want to load existing data from saved from?"
        );
  
        if (result) {
          //this.state.savedResponse = JSON.parse(partialResponse);
          this.setState({ savedResponse: JSON.parse(partialResponse) })
          saved_response = true;
        } else {
          localStorage.removeItem(this.props.qform.id);
        }
      }
  
      // If not using saved QuestionnaireResponse, create a new one
      let newResponse = {
        resourceType: 'QuestionnaireResponse',
        status: 'draft',
        item: []
      }
  
      const items = this.props.qform.item;
      this.prepopulate(items, newResponse.item, saved_response)
  
      if (!saved_response) {
        this.state.savedResponse = newResponse
      }
    }

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

    render() {
      return (
        <div>
          <div id="formContainer">
          </div>
        </div>
      );
    }
}