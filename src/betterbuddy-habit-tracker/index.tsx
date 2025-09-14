import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Importing 'types.ts' here for its side effects to ensure global JSX namespace augmentations are loaded application-wide.
import './types';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
