import React from 'react';
import { FileQuestion, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <FileQuestion size={48} />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="p-4 bg-amber-50 rounded-full mb-4 text-amber-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};