import React, { useState } from 'react';
import { Copy, Check, Edit2, Trash2, Link2 } from 'lucide-react';
import { NetworkBadge } from './StatusBadge';
import type { Wallet } from '../types';

interface WalletCardProps {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: number) => void;
  onViewProjects?: (wallet: Wallet) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onEdit, onDelete, onViewProjects }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string) => {
    if (wallet.network === 'SOL') {
      return `${address.slice(0, 8)}...${address.slice(-8)}`;
    }
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  const formatBalance = (balance: number) => {
    if (balance === 0) return '0';
    if (balance < 0.0001) return '<0.0001';
    return balance.toFixed(4);
  };

  return (
    <div className="card p-5 group border border-transparent hover:border-amber-200 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl ${wallet.status === 'active' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
          <div className={`w-3 h-3 rounded-full ${wallet.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900 font-heading truncate">
              {wallet.label || 'Unnamed Wallet'}
            </h3>
            <button
              onClick={() => onEdit(wallet)}
              className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"
            >
              <Edit2 size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={copyAddress}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-amber-50 rounded-lg transition-colors group/addr"
            >
              <code className="text-sm font-mono text-gray-600 group-hover/addr:text-amber-700">
                {formatAddress(wallet.address)}
              </code>
              {copied ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Copy size={14} className="text-gray-400" />
              )}
            </button>
            <NetworkBadge network={wallet.network} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-cream-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-0.5">Balance</p>
              <p className="text-sm font-bold text-gray-900">{formatBalance(wallet.balance)} ETH</p>
            </div>
            <div className="bg-cream-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-0.5">Projects</p>
              <p className="text-sm font-bold text-gray-900">{wallet.project_count || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onViewProjects && (
              <button
                onClick={() => onViewProjects(wallet)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
              >
                <Link2 size={14} />
                View Projects
              </button>
            )}
            <button
              onClick={() => onDelete(wallet.id)}
              className="flex items-center justify-center gap-1.5 p-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {wallet.notes && (
        <p className="mt-3 text-sm text-gray-500 pl-[4.5rem]">{wallet.notes}</p>
      )}
    </div>
  );
};