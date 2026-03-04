'use client';

import { Component, type ReactNode } from 'react';
import Button from './Button';
import Heading from './Heading';
import Text from './Text';
import Card from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  showReload?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
  retryCount: number;
}

// Enhanced error reporting for async operations
const reportError = (error: Error, errorInfo: React.ErrorInfo, errorId: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ErrorBoundary [${errorId}]`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error.stack);
    console.groupEnd();
  }

  // In production, you could send this to an error reporting service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // Example integration:
    // Sentry.captureException(error, {
    //   tags: { errorBoundary: true },
    //   extra: { errorInfo, errorId, retryCount }
    // });
  }
};

export default class ErrorBoundary extends Component<Props, State> {
  private retryTimeouts: Set<NodeJS.Timeout> = new Set();

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = this.state.errorId || 'unknown';
    reportError(error, errorInfo, errorId);
  }

  componentWillUnmount() {
    // Clean up any pending timeouts
    this.retryTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.retryTimeouts.clear();
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1,
    }));

    // If there's a custom retry function, call it
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, retryCount } = this.state;
      const isAsyncError =
        error?.message?.includes('async') ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('network') ||
        error?.name === 'TypeError';

      const errorTitle = isAsyncError ? 'Connection Trouble' : 'Oops! Something went wrong';

      const errorMessage = isAsyncError
        ? 'Having trouble loading content. This could be a temporary network issue.'
        : "Don't worry, it happens to the best of us. Just like when the beer lines decide to foam up during Friday rush!";

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card variant="bordered" className="max-w-md text-center">
            <div className="text-6xl mb-4">{isAsyncError ? '📡' : '😅'}</div>
            <Heading level={3} align="center" className="mb-2">
              {errorTitle}
            </Heading>
            <Text align="center" color="muted" className="mb-6">
              {errorMessage}
              {retryCount > 0 && (
                <Text size="sm" className="mt-2 text-orange">
                  Retry attempt: {retryCount}
                </Text>
              )}
            </Text>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="secondary"
                size="medium"
                disabled={retryCount >= 3}
              >
                {retryCount >= 3 ? 'Max Retries' : 'Try Again'}
              </Button>
              {this.props.showReload !== false && (isAsyncError || retryCount >= 2) && (
                <Button onClick={this.handleReload} variant="primary" size="medium">
                  Reload Page
                </Button>
              )}
              <Button href="/" variant="ghost" size="medium">
                Go Home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-charcoal/60">
                  Error details (development only)
                </summary>
                <div className="mt-2 text-xs bg-charcoal/5 p-2 rounded overflow-auto space-y-2">
                  <div>
                    <strong>Error:</strong> {error.toString()}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 text-xs">{error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorId && (
                    <div>
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                  )}
                </div>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    onRetry?: () => void;
    showReload?: boolean;
  }
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={options?.fallback}
        onRetry={options?.onRetry}
        showReload={options?.showReload}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Async Error Boundary specifically for server components and data fetching
export function AsyncErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={fallback}
      showReload={true}
      onRetry={() => {
        // For async operations, we typically want to reload the page
        // since we can't easily retry server-side data fetching
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
