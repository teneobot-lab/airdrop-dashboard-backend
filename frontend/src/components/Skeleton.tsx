import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] rounded-lg ${className}`} />
  );
};

export const ProjectCardSkeleton: React.FC = () => (
  <div className="card p-5">
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export const WalletCardSkeleton: React.FC = () => (
  <div className="card p-5">
    <div className="flex items-start gap-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-5 w-1/2 mb-2" />
        <Skeleton className="h-8 w-full mb-3 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="card p-6 border-l-4 border-amber-400">
    <div className="flex items-start justify-between">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-9 w-16" />
      </div>
      <Skeleton className="w-12 h-12 rounded-2xl" />
    </div>
  </div>
);