import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CyberpunkWarp from './components/CyberpunkWarp';
import reportWebVitals from './reportWebVitals';

const warpRoot = document.getElementById('warp-root');

if (warpRoot) {
  const root = ReactDOM.createRoot(warpRoot);

  root.render(
    <React.StrictMode>
      <CyberpunkWarp />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
