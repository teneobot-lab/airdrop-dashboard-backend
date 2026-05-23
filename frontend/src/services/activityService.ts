import api from './api';
import type { ActivityLog } from '../types';

export interface GetActivityParams {
  limit?: number;
  type?: string;
}

export const activityService = {
  getAll: async (params?: GetActivityParams): Promise<ActivityLog[]> => {
    const response = await api.get<ActivityLog[]>('/api/activity', { params });
    return response.data;
  },
};