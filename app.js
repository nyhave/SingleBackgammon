import React from 'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';

import Board from './components/Board.js';
import ErrorBoundary from './components/ErrorBoundary.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(
    ErrorBoundary,
    null,
    React.createElement(Board)
  )
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
