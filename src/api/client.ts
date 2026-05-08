import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ResponseResult } from '../types/api';

/**
 * Storage key for JWT token in localStorage.
 * Centralized so we don't accidentally use different keys in different places.
 */
const TOKEN_KEY = 'bankx_token';

/**
 * Helpers for token persistence.
 * Using localStorage = token survives page refresh & new tabs (good for demo).
 *
 * Trade-off: localStorage is vulnerable to XSS. Production banking systems
 * should use httpOnly cookies, but that requires backend cookie support
 * which we haven't implemented yet.
 */
export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

/**
 * The axios instance used for all backend calls.
 *
 * Configured with:
 *   - baseURL: empty (we rely on Vite's /api proxy in dev)
 *   - timeout: 10s
 *   - JSON content-type by default
 */
const client: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor ────────────────────────────────────────
// Automatically attaches the JWT token to every outgoing request.
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, 
  (error) => Promise.reject(error)
);

// ─── Response interceptor ───────────────────────────────────────
// 1. Unwraps ResponseResult.data on success
// 2. Handles 401 by clearing token (caller decides redirect)
// 3. Surfaces backend error messages
client.interceptors.response.use(
  // Success path: HTTP 2xx
  (response) => {
    const result = response.data as ResponseResult<unknown>;

    if (result.code === '0000') {
      response.data = result.data;
      return response;
    }


    return Promise.reject(new BackendError(result.code, result.message));
  },

  // Error path: HTTP 4xx/5xx or network failure
  (error: AxiosError<ResponseResult<unknown>>) => {
    // Network error / timeout — no response from backend
    if (!error.response) {
      return Promise.reject(new BackendError('NETWORK', 'Network error or timeout'));
    }

    const { status, data } = error.response;

    // 401: clear token. Routing layer will detect missing token and redirect.
    if (status === 401) {
      tokenStorage.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?reason=session_expired';
      }
    }

    // Use backend's error code/message if available, otherwise use HTTP status
    const code = data?.code ?? String(status);
    const message = data?.message ?? error.message ?? 'Unknown error';

    return Promise.reject(new BackendError(code, message));
  }
);

/**
 * Custom error class so callers can distinguish backend errors from generic ones.
 * Carries the backend's error code (e.g. "1002") and message.
 */
export class BackendError extends Error {
    public code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'BackendError';
  }
}

export default client;