import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';

import { EmergencyProvider } from './context/EmergencyContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <EmergencyProvider>
        <App />
      </EmergencyProvider>
    </AuthProvider>
  </React.StrictMode>,
);
