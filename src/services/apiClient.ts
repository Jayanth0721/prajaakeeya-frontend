import axios from 'axios';
import * as Sentry from '@sentry/react';
import useAuthStore from '../store/useAuthStore';
import { COOKIE_AUTH } from '../config/authMode';

const apiHost = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;
const normalizedHost = apiHost ? String(apiHost).replace(/\/+$/g, '') : '';
const baseURL = normalizedHost ? `${normalizedHost}/api` : '/api';

const apiClient = axios.create({
  baseURL,
  timeout: 60000,
  // COOKIE_AUTH: send the httpOnly `session` cookie on every request. Without
  // this the cookie is never attached and all authenticated calls 401. Off in
  // legacy mode (auth rides on the Authorization header instead).
  withCredentials: COOKIE_AUTH,
});

apiClient.interceptors.request.use((config) => {
  // In cookie mode the JWT lives in an httpOnly cookie the browser attaches
  // automatically, so there is no token to read here. The store's token is
  // null; this just no-ops and we rely on withCredentials above.
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const GENERIC_ERROR_MESSAGE = 'Something went wrong, Please try after sometime';

// COOKIE_AUTH refresh de-dupe: access tokens are short-lived (~15 min), so a
// 401 normally just means "token expired" rather than "logged out". We attempt
// a single /auth/refresh and retry the original request. This shared promise
// ensures that if several requests 401 at once, only ONE refresh fires and the
// rest await the same result — otherwise concurrent refreshes would race and
// rotate each other's cookies. Reset to null once settled so the next genuine
// expiry can refresh again. A separate bare axios instance avoids re-entering
// this interceptor (and a circular import on authService).
let refreshing: Promise<unknown> | null = null;
const refreshClient = axios.create({ baseURL, timeout: 60000, withCredentials: true });

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (COOKIE_AUTH && error.response?.status === 401) {
      const original = error.config;
      // Never try to refresh the refresh call itself, and only retry once.
      const isAuthEndpoint =
        typeof original?.url === 'string' &&
        (original.url.includes('/auth/refresh') ||
          original.url.includes('/auth/logout') ||
          original.url.includes('/auth/google/exchange') ||
          original.url.includes('/auth/admin/login'));
      if (original && !original._retried && !isAuthEndpoint) {
        original._retried = true;
        try {
          refreshing ??= refreshClient.post('/auth/refresh');
          await refreshing; // server rotates the session cookie on success
          refreshing = null;
          return apiClient(original); // replay the original request with the fresh cookie
        } catch (refreshErr) {
          refreshing = null;
          // Refresh expired/revoked → a real logout.
          useAuthStore.getState().logout();
          return Promise.reject(refreshErr);
        }
      }
      // A request that 401s even AFTER a successful refresh-and-retry (or a 401
      // on an auth endpoint itself) means the session is genuinely gone — log
      // out rather than leave the user in a broken half-authenticated state.
      if (original?._retried) {
        useAuthStore.getState().logout();
      }
    } else if (!COOKIE_AUTH && error.response?.status === 401) {
      // Legacy header-auth: a 401 means the stored token is no longer valid.
      useAuthStore.getState().logout();
    }
    const isNetworkOrTimeout =
      !error.response &&
      (error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        error.message === 'Network Error' ||
        (typeof error.message === 'string' && error.message.toLowerCase().includes('timeout')));
    if (isNetworkOrTimeout) {
      error.message = GENERIC_ERROR_MESSAGE;
    }
    // Report API failures to Sentry for diagnostics. Skip 401 (expected auth
    // expiry → handled above) and other 4xx client errors (validation, not
    // found, etc.) to avoid noise; capture server errors (5xx) and network/
    // timeout failures. Status/method/path are attached as context; request and
    // response bodies are deliberately NOT sent to avoid leaking sensitive data.
    const status = error.response?.status;
    const shouldReport = isNetworkOrTimeout || (typeof status === 'number' && status >= 500);
    if (shouldReport && status !== 401) {
      Sentry.captureException(error, {
        tags: { kind: 'api', status: status ?? 'network' },
        extra: {
          method: error.config?.method,
          url: error.config?.url,
        },
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
