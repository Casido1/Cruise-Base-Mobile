import { api } from './api';
import type { Wallet, Transaction } from '../types';

export const walletService = {
    getBalance: async (): Promise<Wallet> => {
        const response = await api.get('/api/wallet/balance');
        return response.data;
    },

    getTransactionHistory: async (page = 1, limit = 10): Promise<{ transactions: Transaction[], total: number }> => {
        const response = await api.get(`/api/wallet/transaction-history?page=${page}&limit=${limit}`);
        return response.data;
    },

    withdraw: async (amount: number, bankAccountId: string, pin: string): Promise<void> => {
        await api.post('/api/wallet/withdraw', { amount, bankAccountId, pin });
    },

    setPin: async (pin: string): Promise<void> => {
        await api.post('/api/wallet/set-pin', JSON.stringify(pin), {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    getBanks: async () => {
        const response = await api.get('/api/wallet/banks');
        return response.data;
    },

    getUserBankAccounts: async (): Promise<any[]> => {
        const response = await api.get('/api/wallet/user-bank-accounts');
        return response.data;
    },

    resolveAccount: async (accountNumber: string, bankCode: string) => {
        const response = await api.get(`/api/wallet/resolve-account?accountNumber=${accountNumber}&bankCode=${bankCode}`);
        return response.data;
    },
};
