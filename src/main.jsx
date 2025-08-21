import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

console.log('main.jsx: initializing application');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/SingleBackgammon">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

console.log('main.jsx: render complete');
