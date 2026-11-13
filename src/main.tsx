import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAdMob, showAppOpenAd } from './lib/admob.ts';

// Initialize AdMob once on app startup
initializeAdMob()
  .then((ok) => {
    if (ok) {
      showAppOpenAd().catch(() => {});
    }
  })
  .catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register PWA Service Worker for offline performance, installability and push notifications on phone
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.log('SW registration note:', err);
      });
  });
}
