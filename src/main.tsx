import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { DeviceProvider } from './contexts/DeviceContext';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <DeviceProvider>
            <App />
          </DeviceProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);