import React from 'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
import { Client } from 'https://esm.sh/boardgame.io@0.50.2/react?deps=react@18.3.1,react-dom@18.3.1';

import { Backgammon } from './game.js';
import Board from './components/Board.js';
import ErrorBoundary from './components/ErrorBoundary.js';

const App = Client({ game: Backgammon, board: Board });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(
    ErrorBoundary,
    null,
    React.createElement(App, { playerID: '0' })
  )
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
