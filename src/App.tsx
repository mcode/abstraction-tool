import React, { Component } from 'react';
import { PatientProvider } from './components/PatientProvider';
import Abstractor from './components/Abstractor';

function App() {
  return (
    <PatientProvider>
      <Abstractor />
    </PatientProvider>
  );
}

export default App;
