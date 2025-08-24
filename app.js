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

function enforceLandscape() {
  if (!/iPhone/i.test(window.navigator.userAgent)) {
    return;
  }

  const warning = document.getElementById('orientation-warning');
  const rootEl = document.getElementById('root');
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  if (isPortrait) {
    warning.classList.remove('hidden');
    rootEl.classList.add('hidden');
  } else {
    warning.classList.add('hidden');
    rootEl.classList.remove('hidden');
  }
}

window.addEventListener('load', enforceLandscape);
window.addEventListener('resize', enforceLandscape);
window.addEventListener('orientationchange', enforceLandscape);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
