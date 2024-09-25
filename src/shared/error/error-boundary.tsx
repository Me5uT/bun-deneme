import { Result } from 'antd';
import React from 'react';

interface IErrorBoundaryProps {
  readonly children: React.ReactNode;
}

interface IErrorBoundaryState {
  readonly error: any;
  readonly errorInfo: any;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  readonly state: IErrorBoundaryState = { error: undefined, errorInfo: undefined };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  //
  render() {
    const { error, errorInfo } = this.state;

    if (error && errorInfo) {
      const errorDetails = DEVELOPMENT ? (
        <details className="preserve-space">
          <summary>{error.toString()}</summary>

          <pre>{errorInfo.componentStack}</pre>
        </details>
      ) : null;
      return (
        <Result
          status={'error'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            height: '100vh',
            // justifyContent: 'center',
            alignItems: 'center',
          }}
          title={<h2 className="error">An unexpected error has occurred.</h2>}
          subTitle={errorDetails}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
