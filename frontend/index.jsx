import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('app'));

const element = (
  <App />
);

root.render(element);
