import React, { useState, useEffect } from 'react';
import { Download, Filter, Calendar, Search } from 'lucide-react';
import { activityService, GetActivityParams } from '../services/activityService';
import { useToast } from '../components/Toast';
import { ActivityItem } from '../components/ActivityItem';
import { EmptyState } from '../components/EmptyState';
import type { ActivityLog, ActionType } from '../types';

const ACTION_TYPES: { value: ActionType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Actions' },
  { value: 'claim', label: 'Claims' },
  { value: 'add_wallet', label: 'Added Wallet' },
  { value: 'add_project', label: 'Added Project' },
  { value: 'update_project', label: 'Updated Project' },
  { value: 'update_wallet', label: 'Updated Wallet' },
  { value: 'delete', label: 'Deleted' },
  { value: 'add_project', label: 'Linked Wallet' },
];

export const Activity: React.FC = () => {
  const { showToast } = useToast();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<ActionType | 'all'>('all');
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchActivities();
  }, [filterType, limit]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: GetActivityParams = { limit };
      if (filterType !== 'all') {
        params.type = filterType;
      }
      const data = await activityService.getAll(params);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity');
    } finally {
      setLoading(false);
    }
  };

  const exportToCsv = () => {
    const headers = ['Date', 'Action', 'Entity Type', 'Entity ID', 'Description'];
    const rows = activities.map(a => [
      new Date(a.created_at).toISOString(),
      a.action_type,
      a.entity_type,
      a.entity_id || '',
      a.description,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('success', 'Activity log exported');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Activity</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track all your airdrop activities
          </p>
        </div>
        {activities.length > 0 && (
          <button
            onClick={exportToCsv}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ActionType | 'all')}
            className="input-field w-auto"
          >
            {ACTION_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 ml-auto text-sm text-gray-500">
            <span>{activities.length} activities</span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      {loading ? (
        <div className="card p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/4 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchActivities} className="btn-primary">
            Retry
          </button>
        </div>
      ) : activities.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="divide-y divide-amber-50">
            {activities.map((activity, index) => (
              <div key={activity.id} style={{ animationDelay: `${index * 30}ms` }}>
                <ActivityItem activity={activity} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No activity yet"
          description="Your airdrop activities will appear here"
          icon={<Calendar size={48} />}
        />
      )}

      {/* Load More */}
      {activities.length >= limit && (
        <div className="text-center">
          <button
            onClick={() => setLimit(prev => prev + 50)}
            className="btn-secondary"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};