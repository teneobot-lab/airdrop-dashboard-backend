import React from 'react';
import { Wallet, Link2 } from 'lucide-react';
import { NetworkBadge, StatusBadge } from './StatusBadge';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatReward = (reward: number | null) => {
    if (!reward) return '-';
    return `$${reward.toLocaleString()}`;
  };

  return (
    <div className="card p-5 group hover:border-amber-200 border border-transparent animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{project.logo_emoji || '🪙'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 font-heading truncate">{project.name}</h3>
            <StatusBadge status={project.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <NetworkBadge network={project.network} />
            {project.reward_token && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                {project.reward_token}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-cream-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-0.5">Est. Reward</p>
              <p className="text-sm font-bold text-gray-900">{formatReward(project.estimated_reward)}</p>
            </div>
            <div className="bg-cream-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-0.5">Claim Date</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(project.claim_date)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Wallet size={14} />
              {project.wallet_count || 0} wallet{(project.wallet_count || 0) !== 1 ? 's' : ''}
            </span>
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 font-medium text-xs"
              >
                Visit Website →
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(project)}
              className="flex-1 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};