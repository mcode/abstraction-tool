import React, { Component, ReactNode} from "react";
//import "./QuestionnaireForm.css";
import { R4 } from "@ahryman40k/ts-fhir-types";

interface Props {
  fhirVersion: string;
  qform: R4.IQuestionnaire;
}

 export default class QuestionnaireForm extends Component <Props> {

   constructor(props: Props) {
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
          savedResponse: null,
        };
        //console.log(props.qform);
    }


    componentDidMount() {
      //console.log(this.props.qform);
      let lform = window.LForms.Util.convertFHIRQuestionnaireToLForms(this.props.qform);
      console.log(lform);
  
      lform.templateOptions = {
        showFormHeader: false,
        showColumnHeaders: false,
        showQuestionCode: false,
        hideFormControls: true,
        showFormOptionPanelButton: true//,
        //allowHTMLInInstructions: true,
        //showCodingInstruction: true
      };
  
      //console.log(JSON.stringify(lform));
      window.LForms.Util.addFormToPage(lform, "formContainer")
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