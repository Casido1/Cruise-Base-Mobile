import { api } from './api';
import type { Vehicle, ContractProgress, VehicleToCreate, VehicleToUpdate } from '../types';

export const vehicleService = {
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await api.get('/api/vehicle');
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data?.data && Array.isArray(data.data)) return data.data;
        if (data?.Data && Array.isArray(data.Data)) return data.Data;
        return [];
    },

    getVehiclesByUserId: async (userId: string): Promise<any> => {
        const response = await api.get(`/api/vehicle/byuserid/${userId}`);
        return response.data;
    },

    getVehicleById: async (id: string): Promise<Vehicle> => {
        const response = await api.get(`/api/vehicle/${id}`);
        const data = response.data;
        return data.data || data.Data || data;
    },

    createVehicle: async (data: VehicleToCreate): Promise<Vehicle> => {
        const response = await api.post('/api/vehicle', data);
        return response.data;
    },

    getDriverProgress: async (vehicleId: string): Promise<ContractProgress> => {
        const response = await api.get(`/api/vehicle/${vehicleId}/progress/driver`);
        return response.data;
    },

    getOwnerProgress: async (vehicleId: string): Promise<ContractProgress> => {
        const response = await api.get(`/api/vehicle/${vehicleId}/progress/owner`);
        return response.data;
    },

    createContract: async (data: any): Promise<void> => {
        await api.post('/api/contract', data);
    },

    updateVehicle: async (id: string, data: VehicleToUpdate): Promise<void> => {
        await api.put(`/api/vehicle/${id}`, data);
    },

    deleteVehicle: async (id: string): Promise<void> => {
        await api.delete(`/api/vehicle/${id}`);
    },

    uploadVehiclePicture: async (vehicleId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/api/vehicle/${vehicleId}/picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
