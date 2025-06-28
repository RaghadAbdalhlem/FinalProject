// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // ייבוא קובץ ה-App.js שלך
import './index.css'; // אם יש לך קובץ CSS מותאם אישית

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
