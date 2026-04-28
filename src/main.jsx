window.onerror = function(msg, url, line, col, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="background: #0a0a0a; color: #22c55e; padding: 40px; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
      <h1 style="font-size: 24px; margin-bottom: 10px;">AgriVerify Demo Error</h1>
      <p style="color: #666; font-size: 14px; max-width: 400px; margin-bottom: 20px;">${msg}</p>
      <div style="background: #111; padding: 15px; border-radius: 10px; font-family: monospace; font-size: 10px; text-align: left; color: #ff5555; max-width: 90vw; overflow-x: auto;">
        ${error?.stack || 'No stack trace available'}
      </div>
      <button onclick="window.location.reload()" style="margin-top: 20px; background: #22c55e; color: black; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer;">Reload App</button>
    </div>`;
  }
  return false;
};

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n.js';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
