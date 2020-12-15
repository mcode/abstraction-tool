import React from 'react';
import ErrorDetails from '../ErrorDetails';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
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
    const { error, hasError, errorInfo } = this.state;
    return hasError && error ? <ErrorDetails error={error} errorInfo={errorInfo} /> : this.props.children;
  }
}

export default ErrorBoundary;
