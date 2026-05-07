import client from './client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

/**
 * Authenticate with email + password.
 * Returns the JWT token + user info on success.
 * Throws BackendError with code "1002" on bad credentials.
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/api/v1/auth/login', payload);
    return response.data;
}

/**
 * Register a new customer account.
 * Returns the JWT token (user is auto-logged-in).
 * Throws BackendError with code "1005" if email already exists.
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/api/v1/auth/register', payload);
    return response.data;
}

/**
 * Send a 6-digit verification code to the given email.
 * Code is valid for 30 minutes; rate-limited to one request per 5 minutes per email.
 *
 * Throws BackendError on:
 *   - 1005: Email already registered
 *   - 1006 (or your TOO_MANY_REQUESTS): Rate limit exceeded
 */
export async function sendVerification(email: string): Promise<void>{
    await client.post(`/api/v1/auth/send-code?email=${encodeURIComponent(email)}`);
}

/**
 * Logout - invalidates token in Redis and adds to blacklist.
 * Note: Backend reads token from Authorization header, not from request body.
 */
export async function logout(): Promise<void>{
    await client.post('/api/v1/auth/logout');
}

  