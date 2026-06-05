// Fail closed: default to the real API. Mock mode must be opted into
// explicitly via VITE_APP_MODE=mock, so a missing/misbuilt env var can never
// silently drop the app into mock mode (which trusts the localStorage user,
// role included, and skips /auth/me).
export const APP_MODE = (import.meta.env.VITE_APP_MODE || 'api').toLowerCase();
export const isMockMode = APP_MODE === 'mock';
