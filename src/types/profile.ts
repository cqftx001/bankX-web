export interface UserProfileVo {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    birthDate: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface UpdateMyProfileRequest {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface UpdateProfileRequest {
    // Tier 2: KYC fields
    firstName?: string;
    lastName?: string;
    phone?: string;
    birthDate?: string;

    // Email
    email?: string;
    // Tier 1: Basic fields
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}
