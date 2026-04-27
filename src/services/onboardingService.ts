import { api } from './api';
import type { OnboardingSchedule, CreateOnboardingScheduleRequest } from '../types/onboarding';

export const onboardingService = {
    getScheduleByUserId: async (userId: string): Promise<OnboardingSchedule | null> => {
        try {
            const response = await api.get(`/api/onboarding/user/${userId}`);
            return response.data.data || response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    getAllSchedules: async (): Promise<OnboardingSchedule[]> => {
        const response = await api.get('/api/onboarding');
        console.log('[DEBUG] getAllSchedules raw response.data:', JSON.stringify(response.data));
        const schedules = response.data.data || response.data || [];
        console.log('[DEBUG] getAllSchedules parsed schedules:', JSON.stringify(schedules));
        return schedules;
    },

    createSchedule: async (data: CreateOnboardingScheduleRequest): Promise<OnboardingSchedule> => {
        const response = await api.post('/api/onboarding', data);
        return response.data.data || response.data;
    },
};
