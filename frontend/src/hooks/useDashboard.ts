import { useState, useEffect, useCallback } from 'react';
import { statsService } from '../services/statsService';
import { activityService } from '../services/activityService';
import type { Stats, ActivityLog } from '../types';

interface UseDashboardReturn {
  stats: Stats | null;
  recentActivity: ActivityLog[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboard = (): UseDashboardReturn => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, activityData] = await Promise.all([
        statsService.get(),
        activityService.getAll({ limit: 5 })
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, recentActivity, loading, error, refetch: fetchData };
};