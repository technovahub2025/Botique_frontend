import { Component } from 'react';
import { Outlet } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleNavigate = (path) => {
    window.location.href = path;
  };

  render() {
    if (this.state.hasError) {
      const { title = 'Something went wrong', description = 'An unexpected error occurred.', showHomeButton = false } = this.props;

      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-heading font-bold text-charcoal mb-2">{title}</h1>
            <p className="text-gray-600 text-sm mb-6">{description}</p>
            {showHomeButton && (
              <button
                onClick={() => this.handleNavigate('/admin')}
                className="bg-charcoal text-ivory px-4 py-2 rounded-md font-medium hover:bg-deep-brown mr-2"
              >
                Back to Dashboard
              </button>
            )}
            <button
              onClick={this.handleReload}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return <Outlet />;
  }
}

export default ErrorBoundary;
