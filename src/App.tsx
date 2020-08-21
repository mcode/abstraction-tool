import React from 'react';
import { PatientProvider } from './components/PatientProvider';
import Abstractor from './components/Abstractor';
import QuestionnaireForm from "./components/QuestionnaireForm/questionnaireform";


function App() {
  return (
    <PatientProvider>
      <Abstractor />
    </PatientProvider>
    <QuestionnaireForm> 
    </QuestionnaireForm>
  );
}

export default App;
