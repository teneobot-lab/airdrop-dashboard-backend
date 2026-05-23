import api from './api';
import type { Project, CreateProjectInput } from '../types';

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/api/projects');
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectInput): Promise<Project> => {
    const response = await api.post<Project>('/api/projects', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateProjectInput>): Promise<Project> => {
    const response = await api.put<Project>(`/api/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  },

  linkWallet: async (projectId: number, walletId: number): Promise<void> => {
    await api.post(`/api/projects/${projectId}/wallets`, { wallet_id: walletId });
  },

  unlinkWallet: async (projectId: number, walletId: number): Promise<void> => {
    await api.delete(`/api/projects/${projectId}/wallets/${walletId}`);
  },
};