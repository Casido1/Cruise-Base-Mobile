import { api } from './api';
import type { LoginCredentials, AuthResponse, RegisterData } from '../types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post('/api/authentication/login', credentials);
        return response.data;
    },

    register: async (data: RegisterData): Promise<void> => {
        await api.post('/api/authentication/register', data);
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await api.post('/api/authentication/refresh', { refreshToken });
        return response.data;
    },

    getUserDetails: async () => {
        const response = await api.get('/api/user/details');
        return {
            ...response.data,
            username: response.data.userName,
        };
    },
    uploadProfilePicture: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/api/user/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateUserDetails: async (data: any) => {
        const response = await api.put('/api/user/details', data);
        return response.data;
    },
};
