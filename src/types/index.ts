export type UserRole = 'SuperAdmin' | 'Admin' | 'Owner' | 'Driver';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
    profilePicture?: string;
    companyName?: string;
    companyLogo?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
        address: string;
        phoneNumber: string;
        roles: string[];
        profilePicture?: string;
        companyName?: string;
        companyLogoUrl?: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: UserRole | number;
}


export interface OwnerPercentage {
    fullName: string;
    percentage: number;
}

export interface Vehicle {
    id: string;
    name: string;
    brand?: string;
    model?: string;
    plateNumber: string;
    color: string;
    isActive: boolean;
    status?: boolean;
    contractType?: string;
    tenure?: number;
    paymentAmount?: number;
    paymentFrequency?: string;
    startDate?: string;
    picture?: string | {
        url: string;
        publicId: string;
    };
    userId?: string;
    driverId?: string;
    driver?: string;
    ownerPercentages?: OwnerPercentage[];
    totalEarned?: number;
    contractId?: string;
}

export interface VehicleToCreate {
    name: string;
    brand: string;
    model: string;
    plateNumber: string;
    color: string;
    userId?: string;
    driverId?: string;
    ownerPercentage?: number;
}

export interface VehicleToUpdate {
    name: string;
    brand: string;
    model: string;
    plateNumber: string;
    color: string;
    userId?: string;
    driverId?: string;
    contractId?: string;
    pictureId?: string;
}

export interface ContractProgress {
    vehicleId: string;
    totalValue: number;
    paidAmount: number;
    percentage: number;
    remainingAmount: number;
}

export interface Company {
    id: string;
    name: string;
    logoUrl?: string;
    address?: string;
    email?: string;
    phoneNumber?: string;
    isActive: boolean;
    createdOn: string;
}

export interface CompanyParameters {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    type: 'Info' | 'Success' | 'Warning' | 'Error';
}
