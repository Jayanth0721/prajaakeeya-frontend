export const APP_MODE = (import.meta.env.VITE_APP_MODE || 'mock').toLowerCase();
export const isMockMode = APP_MODE !== 'api';
