import { api } from './api';
import type { Company, CompanyParameters } from '../types';

export const companyService = {
    getAllCompanies: async (params?: CompanyParameters): Promise<Company[]> => {
        const response = await api.get('api/company', { params });
        return response.data;
    },

    getCompanyById: async (id: string): Promise<Company> => {
        const response = await api.get(`api/company/${id}`);
        return response.data;
    },

    createCompany: async (data: Partial<Company>): Promise<Company> => {
        const response = await api.post('api/company', data);
        return response.data;
    },

    updateCompany: async (id: string, data: Partial<Company>): Promise<void> => {
        await api.put(`api/company/${id}`, data);
    },

    deleteCompany: async (id: string): Promise<void> => {
        await api.delete(`api/company/${id}`);
    },

    uploadLogo: async (id: string, file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`api/company/${id}/logo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }
};
