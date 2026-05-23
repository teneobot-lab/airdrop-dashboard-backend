import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: 'amber' | 'emerald' | 'blue' | 'purple';
}

const colorClasses = {
  amber: { icon: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
  emerald: { icon: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' },
  blue: { icon: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  purple: { icon: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = 'amber' }) => {
  const colors = colorClasses[color];

  return (
    <div className="card p-6 border-l-4 border-amber-400 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 font-heading">{value}</p>
          {trend && (
            <p className="text-xs text-emerald-600 mt-1 font-medium">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${colors.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};