import client from './client';
import type { UserProfileVo, UpdateProfileRequest, UpdateMyProfileRequest } from '../types/profile';
import type { AuthResponse } from '../types/auth';

// -- types

// ── API calls ───────────────────────────────────────────────
export async function getMyProfile(signal?: AbortSignal): Promise<UserProfileVo> {
    const response = await client.get<UserProfileVo>('/api/v1/me/profile', { signal });
    return response.data;
}

export async function updateMyProfile(payload: UpdateMyProfileRequest): Promise<UserProfileVo> {
    const response = await client.put<UserProfileVo>('/api/v1/me/profile/update', payload);
    return response.data;
}

export async function updateUserProfile(userId: string, payload: UpdateProfileRequest): Promise<UserProfileVo> {
    const response = await client.put<UserProfileVo>(
        `/api/v1/manager/profile/${userId}/update`,
        payload,
    );
    return response.data;
}

export async function requestEmailChange(newEmail: string): Promise<void> {
    await client.post(`/api/v1/me/profile/email/request?newEmail=${encodeURIComponent(newEmail)}`);
}

export async function confirmEmailChange(code: string): Promise<AuthResponse> {
    const response = await client.put<AuthResponse>(
        `/api/v1/me/profile/email/confirm?code=${encodeURIComponent(code)}`,
    );
    return response.data;
}