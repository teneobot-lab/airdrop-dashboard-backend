import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Wallet, Calendar, Plus, ArrowRight, Loader } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { StatCard } from '../components/StatCard';
import { ActivityItem } from '../components/ActivityItem';
import { EmptyState } from '../components/EmptyState';
import { StatCardSkeleton } from '../components/Skeleton';

export const Dashboard: React.FC = () => {
  const { stats, recentActivity, loading, error } = useDashboard();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // The useDashboard hook will handle refetching
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-heading text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="card p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={handleRefresh} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your crypto airdrop journey
          </p>
        </div>
        {refreshing && (
          <Loader size={20} className="animate-spin text-amber-500" />
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats?.total_projects || 0}
          icon={<Coins size={24} />}
          color="amber"
        />
        <StatCard
          title="Active Wallets"
          value={stats?.active_wallets || 0}
          icon={<Wallet size={24} />}
          color="blue"
        />
        <StatCard
          title="Pending Claims"
          value={stats?.pending_claims || 0}
          icon={<Calendar size={24} />}
          color="purple"
        />
        <StatCard
          title="Recent Activity"
          value={stats?.recent_activity_count || 0}
          icon={<ArrowRight size={24} />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Claims */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading text-gray-900">Upcoming Claims</h2>
            <Calendar size={18} className="text-amber-500" />
          </div>

          {stats?.upcoming_claims && stats.upcoming_claims.length > 0 ? (
            <div className="space-y-3">
              {stats.upcoming_claims.map((claim, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-cream-50 to-white rounded-xl border border-amber-100 hover:shadow-md transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-2xl">{claim.logo_emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{claim.project_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(claim.claim_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  {claim.estimated_reward && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        ${claim.estimated_reward.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">Est. reward</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No upcoming claims this month</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading text-gray-900">Recent Activity</h2>
            <button
              onClick={() => navigate('/activity')}
              className="text-sm text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </button>
          </div>

          {recentActivity.length > 0 ? (
            <div className="divide-y divide-amber-50">
              {recentActivity.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-bold font-heading text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/projects?new=true')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Project
          </button>
          <button
            onClick={() => navigate('/wallets?new=true')}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Wallet
          </button>
        </div>
      </div>
    </div>
  );
};