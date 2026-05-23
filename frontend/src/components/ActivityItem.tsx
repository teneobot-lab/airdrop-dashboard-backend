import React from 'react';
import { Coins, Wallet, Plus, FileText, Pencil, Trash2, Link2 } from 'lucide-react';
import type { ActivityLog } from '../types';

interface ActivityItemProps {
  activity: ActivityLog;
}

const actionConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  claim: {
    icon: <Coins size={16} />,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
  add_wallet: {
    icon: <Wallet size={16} />,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  add_project: {
    icon: <Plus size={16} />,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  update_project: {
    icon: <Pencil size={16} />,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  update_wallet: {
    icon: <Pencil size={16} />,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  delete: {
    icon: <Trash2 size={16} />,
    color: 'text-red-600',
    bg: 'bg-red-100',
  },
  link_wallet: {
    icon: <Link2 size={16} />,
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
  },
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const config = actionConfig[activity.action_type] || actionConfig.update_project;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors animate-slide-up">
      <div className={`p-2.5 rounded-xl ${config.bg}`}>
        <span className={config.color}>{config.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {activity.entity_type} • {formatTime(activity.created_at)}
        </p>
      </div>
    </div>
  );
};