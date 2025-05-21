import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { FreightProvider } from './contexts/FreightContext';
import { NotificationProvider } from './contexts/NotificationContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FreightProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </FreightProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);