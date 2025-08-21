import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

const basename = '/SingleBackgammon';
console.log('main.jsx: initializing application');
console.log(`main.jsx: using BrowserRouter basename ${basename}`);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

console.log('main.jsx: render complete');
