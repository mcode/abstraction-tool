import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

interface Props {
  error: Error;
  errorInfo: React.ErrorInfo | null;
}

const ErrorDetails: React.FC<Props> = props => (
  <div>
    <h2>There was an error rendering the questionnaire</h2>
    <Alert severity="error">
      <AlertTitle>{props.error && props.error.toString()}</AlertTitle>
      <details style={{ whiteSpace: 'pre-wrap' }}>{props.errorInfo && props.errorInfo.componentStack}</details>
    </Alert>
  </div>
);

export default ErrorDetails;
