import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorProps {
  children: React.ReactNode;
}

class AppError extends React.Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>There was an error rendering the questionnaire</h2>
          <Alert severity="error">
            <AlertTitle>{this.state.error && this.state.error.toString()}</AlertTitle>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          </Alert>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AppError;
