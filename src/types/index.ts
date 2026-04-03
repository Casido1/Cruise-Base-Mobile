export type UserRole = 'SuperAdmin' | 'Admin' | 'Owner' | 'Driver';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
    profilePicture?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
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

export interface Wallet {
    id: string;
    balance: number;
    currency: string;
    isPinSet: boolean;
}

export interface Transaction {
    id: string;
    amount: number;
    type: 'Commission' | 'Collection' | 'Withdrawal' | 'Split';
    status: 'Pending' | 'Completed' | 'Failed';
    createdAt: string;
    description: string;
}

export interface Vehicle {
    id: string;
    name: string;
    brand?: string;
    model?: string;
    plateNumber: string;
    color: string;
    isActive: boolean;
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
    contractId?: string;
}

export interface VehicleToCreate {
    name: string;
    brand: string;
    model: string;
    plateNumber: string;
    color: string;
    userId?: string;
    ownerPercentage?: number;
}

export interface VehicleToUpdate {
    name: string;
    brand: string;
    model: string;
    plateNumber: string;
    color: string;
    userId?: string;
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
    createdAt: string;
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
