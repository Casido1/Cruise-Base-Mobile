import { api } from './api';
import type { TelemetryDTO, DeviceRegistration } from '../types';

export const telemetryService = {
    getTelemetryHistory: async (vehicleId: string, limit: number = 100): Promise<TelemetryDTO[]> => {
        const response = await api.get(`/api/telemetry/vehicle/${vehicleId}`, {
            params: { limit }
        });
        const data = response.data;
        return data.data || data.Data || data;
    },

    getLatestTelemetry: async (vehicleId: string): Promise<TelemetryDTO> => {
        const response = await api.get(`/api/telemetry/vehicle/${vehicleId}/latest`);
        const data = response.data;
        return data.data || data.Data || data;
    },

    registerDevice: async (data: DeviceRegistration): Promise<boolean> => {
        const response = await api.post('/api/telemetry/register', data);
        const result = response.data;
        return result.data || result.Data || result;
    },

    stopVehicle: async (vehicleId: string): Promise<boolean> => {
        const response = await api.post(`/api/telemetry/stop/${vehicleId}`);
        const result = response.data;
        return result.data || result.Data || result;
    }
};
