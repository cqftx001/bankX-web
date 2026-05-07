/**
 * Login credentials.
 * Mirrors com.bankx.demo.user.entity.LoginRequest.
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Registration form data.
 * Mirrors com.bankx.demo.user.entity.RegisterRequest.
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    code: string;
}

/**
 * Successful authentication response.
 * Mirrors com.bankx.demo.user.entity.AuthResponse.
 */
export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    expiration: number;
    userId: string;
    email: string;
    roles: string;
}