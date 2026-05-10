import { api } from './api';
import type { Geofence } from '../types';

export const geofenceService = {
  getGeofencesByVehicleId: async (vehicleId: string) => {
    const response = await api.get<{ data: Geofence[] }>(`/api/telemetry/geofence/vehicle/${vehicleId}`);
    return response.data.data;
  },

  createGeofence: async (geofenceData: Omit<Geofence, 'id' | 'traccarGeofenceId'>) => {
    const response = await api.post<{ data: boolean }>('/api/telemetry/geofence', geofenceData);
    return response.data.data;
  },

  deleteGeofence: async (geofenceId: string) => {
    const response = await api.delete<{ data: boolean }>(`/api/telemetry/geofence/${geofenceId}`);
    return response.data.data;
  }
};
