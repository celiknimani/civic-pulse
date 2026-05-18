import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from '@core/i18n';
import { translator } from './i18n';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nProvider translator={translator}>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);

const browserWindow = window as Window & { __civicPulseFallbackTimer?: number };
if (browserWindow.__civicPulseFallbackTimer) {
  window.clearTimeout(browserWindow.__civicPulseFallbackTimer);
}
document.documentElement.classList.add('react-mounted');
