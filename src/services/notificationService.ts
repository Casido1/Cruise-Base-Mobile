import { api } from './api';
import type { Notification } from '../types';

export const notificationService = {
    getUserNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('api/notification');
        return response.data;
    },

    markAsRead: async (id: string): Promise<void> => {
        await api.patch(`api/notification/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch('api/notification/read-all');
    },

    deleteNotification: async (id: string): Promise<void> => {
        await api.delete(`api/notification/${id}`);
    }
};
