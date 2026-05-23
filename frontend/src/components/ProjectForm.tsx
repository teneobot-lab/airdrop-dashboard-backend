import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Network, ProjectStatus, CreateProjectInput, Project } from '../types';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectInput) => void;
  onCancel: () => void;
}

const EMOJI_OPTIONS = ['🪂', '🪙', '⚡', '🔮', '👑', '🍃', '🌉', '🚀', '💎', '🌙', '⭐', '🔥'];
const NETWORK_OPTIONS: Network[] = ['ETH', 'BSC', 'SOL', 'ARB', 'OP', 'BASE', 'OTHER'];
const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'watchlist', label: 'Watchlist' },
];

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: project?.name || '',
    logo_emoji: project?.logo_emoji || '🪙',
    network: project?.network || 'ETH',
    status: project?.status || 'pending',
    estimated_reward: project?.estimated_reward || undefined,
    reward_token: project?.reward_token || '',
    claim_date: project?.claim_date || '',
    website_url: project?.website_url || '',
    notes: project?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'Project name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Emoji Picker */}
      <div>
        <label className="label">Logo Emoji</label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setFormData({ ...formData, logo_emoji: emoji })}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                formData.logo_emoji === emoji
                  ? 'bg-amber-100 ring-2 ring-amber-400 scale-110'
                  : 'bg-gray-100 hover:bg-amber-50'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Project Name */}
      <div>
        <label htmlFor="name" className="label">Project Name *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400' : ''}`}
          placeholder="e.g., LayerZero"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Network & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Network</label>
          <select
            value={formData.network}
            onChange={(e) => setFormData({ ...formData, network: e.target.value as Network })}
            className="input-field"
          >
            {NETWORK_OPTIONS.map((net) => (
              <option key={net} value={net}>{net}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
            className="input-field"
          >
            {STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reward & Token */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Est. Reward ($)</label>
          <input
            type="number"
            value={formData.estimated_reward || ''}
            onChange={(e) => setFormData({ ...formData, estimated_reward: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="input-field"
            placeholder="2500"
            step="0.01"
          />
        </div>
        <div>
          <label className="label">Reward Token</label>
          <input
            type="text"
            value={formData.reward_token}
            onChange={(e) => setFormData({ ...formData, reward_token: e.target.value })}
            className="input-field"
            placeholder="ZRO"
          />
        </div>
      </div>

      {/* Claim Date */}
      <div>
        <label className="label">Claim Date</label>
        <input
          type="date"
          value={formData.claim_date}
          onChange={(e) => setFormData({ ...formData, claim_date: e.target.value })}
          className="input-field"
        />
      </div>

      {/* Website URL */}
      <div>
        <label className="label">Website URL</label>
        <input
          type="url"
          value={formData.website_url}
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
          className="input-field"
          placeholder="https://..."
        />
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field resize-none h-24"
          placeholder="Eligibility criteria, activities required..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Plus size={18} />
          {project ? 'Update Project' : 'Add Project'}
        </button>
      </div>
    </form>
  );
};