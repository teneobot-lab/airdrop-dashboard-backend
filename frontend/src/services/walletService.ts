import api from './api';
import type { Wallet, CreateWalletInput } from '../types';

export const walletService = {
  getAll: async (): Promise<Wallet[]> => {
    const response = await api.get<Wallet[]>('/api/wallets');
    return response.data;
  },

  getById: async (id: number): Promise<Wallet> => {
    const response = await api.get<Wallet>(`/api/wallets/${id}`);
    return response.data;
  },

  create: async (data: CreateWalletInput): Promise<Wallet> => {
    const response = await api.post<Wallet>('/api/wallets', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateWalletInput>): Promise<Wallet> => {
    const response = await api.put<Wallet>(`/api/wallets/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/wallets/${id}`);
  },
};