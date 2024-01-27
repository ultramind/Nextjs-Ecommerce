export type LoginDetails = {
    email: string;
    password: string;
};

export type forgotPassword = {
    email: string;
};

export type resetPassword = {
    otp: string,
    password: string
    confirmPassword: string;
    email: string;
};

export type RegisterDetails = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
};

export type BusinessProfile = {
    name?: string;
    email?: string
    phone: string;
    address: string;
    cac?: string;
    identityType?: string;
    identityNumber?: string;
    country: string;
    state: string;
    postalCode: number;
    file?: string;
    terms?: true;
    id?: string;
}