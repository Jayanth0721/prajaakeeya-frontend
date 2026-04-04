import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import { getTheme } from './theme';
import useThemeStore from './store/useThemeStore';
import './i18n';
import './index.css';

// ── Force reload when a new service worker activates ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  // Check for SW updates every 60 seconds (catches deploys while tab is open)
  navigator.serviceWorker.ready.then((registration) => {
    setInterval(() => registration.update(), 60 * 1000);
  });
}

// Wrapper component so the ThemeProvider can react to Zustand store changes
const ThemedApp = () => {
  const mode = useThemeStore((s) => s.mode);
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
);
