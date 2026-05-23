import React from 'react';
import type { ProjectStatus, Network } from '../types';

interface StatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completed' },
  watchlist: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Watchlist' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.text.replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  );
};

interface NetworkBadgeProps {
  network: Network;
}

const networkConfig: Record<Network, { bg: string; text: string; emoji: string }> = {
  ETH: { bg: 'bg-gray-100', text: 'text-gray-700', emoji: '🔷' },
  BSC: { bg: 'bg-yellow-100', text: 'text-yellow-700', emoji: '🟡' },
  SOL: { bg: 'bg-gradient-to-r from-purple-100 to-blue-100', text: 'text-purple-700', emoji: '◎' },
  ARB: { bg: 'bg-blue-100', text: 'text-blue-700', emoji: '🔵' },
  OP: { bg: 'bg-red-100', text: 'text-red-700', emoji: '🔴' },
  BASE: { bg: 'bg-blue-100', text: 'text-blue-600', emoji: '🔷' },
  OTHER: { bg: 'bg-gray-100', text: 'text-gray-600', emoji: '⚪' },
};

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({ network }) => {
  const config = networkConfig[network];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className="mr-1">{config.emoji}</span>
      {network}
    </span>
  );
};