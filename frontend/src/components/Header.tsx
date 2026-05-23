import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Wallet, Plus } from 'lucide-react';
import type { Stats } from '../types';

interface HeaderProps {
  stats: Stats | null;
}

export const Header: React.FC<HeaderProps> = ({ stats }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm">
              <span className="text-lg">🪂</span>
            </div>
            <span className="font-heading font-bold text-gray-900 hidden sm:block">Airdrop Dashboard</span>
          </div>
        </div>

        {stats && (
          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200"
            >
              <Coins size={14} />
              {stats.total_projects} Projects
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              <Wallet size={14} />
              {stats.active_wallets} Wallets
            </div>
          </div>
        )}
      </div>
    </header>
  );
};