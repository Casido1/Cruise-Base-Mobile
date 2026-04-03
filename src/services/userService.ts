import { api } from './api';

export const userService = {
    searchUser: async (term: string): Promise<any> => {
        const response = await api.get(`/api/user/search?term=${encodeURIComponent(term)}`);
        return response.data;
    },
};
