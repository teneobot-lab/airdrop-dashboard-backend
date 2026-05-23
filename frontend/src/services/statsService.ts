import api from './api';
import type { Stats } from '../types';

export const statsService = {
  get: async (): Promise<Stats> => {
    const response = await api.get<Stats>('/api/stats');
    return response.data;
  },
};