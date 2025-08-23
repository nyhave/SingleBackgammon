import React from 'https://esm.sh/react@18.3.1';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          className:
            'p-4 m-4 bg-red-100 text-red-800 border border-red-400 rounded',
        },
        `Error: ${this.state.message}`
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
