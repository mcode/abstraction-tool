import React from 'react';
import { PatientProvider } from './providers/PatientProvider';
import Example from './components/Example';

function App() {
  return (
    <PatientProvider>
      <Example />
    </PatientProvider>
  );
}

export default App;
