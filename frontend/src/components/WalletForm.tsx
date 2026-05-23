import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Network, WalletStatus, CreateWalletInput, Wallet } from '../types';

interface WalletFormProps {
  wallet?: Wallet;
  onSubmit: (data: CreateWalletInput) => void;
  onCancel: () => void;
}

const NETWORK_OPTIONS: { value: Network; label: string; emoji: string }[] = [
  { value: 'ETH', label: 'Ethereum', emoji: '🔷' },
  { value: 'BSC', label: 'BNB Chain', emoji: '🟡' },
  { value: 'SOL', label: 'Solana', emoji: '◎' },
  { value: 'ARB', label: 'Arbitrum', emoji: '🔵' },
  { value: 'OP', label: 'Optimism', emoji: '🔴' },
  { value: 'BASE', label: 'Base', emoji: '🔷' },
  { value: 'OTHER', label: 'Other', emoji: '⚪' },
];

export const WalletForm: React.FC<WalletFormProps> = ({ wallet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateWalletInput>({
    label: wallet?.label || '',
    address: wallet?.address || '',
    network: wallet?.network || 'ETH',
    balance: wallet?.balance || 0,
    status: wallet?.status || 'active',
    notes: wallet?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.address?.trim()) {
      newErrors.address = 'Wallet address is required';
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
      {/* Label */}
      <div>
        <label className="label">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="input-field"
          placeholder="e.g., MetaMask Main"
        />
      </div>

      {/* Network Selection */}
      <div>
        <label className="label">Network *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {NETWORK_OPTIONS.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFormData({ ...formData, network: value })}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                formData.network === value
                  ? 'bg-amber-100 ring-2 ring-amber-400 text-amber-800'
                  : 'bg-gray-100 hover:bg-amber-50 text-gray-600'
              }`}
            >
              <span>{emoji}</span>
              <span>{value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="label">Wallet Address *</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className={`input-field font-mono text-sm ${errors.address ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400' : ''}`}
          placeholder={formData.network === 'SOL' ? '7v1N2K...' : '0x742d...'}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      {/* Balance */}
      <div>
        <label className="label">Balance</label>
        <input
          type="number"
          value={formData.balance || ''}
          onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
          className="input-field"
          placeholder="0.00"
          step="0.00000001"
        />
      </div>

      {/* Status */}
      <div>
        <label className="label">Status</label>
        <div className="flex gap-3">
          {(['active', 'inactive'] as WalletStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFormData({ ...formData, status })}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                formData.status === status
                  ? status === 'active'
                    ? 'bg-emerald-100 ring-2 ring-emerald-400 text-emerald-800'
                    : 'bg-gray-200 ring-2 ring-gray-400 text-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input-field resize-none h-24"
          placeholder="Wallet purpose, linked accounts..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
          <Plus size={18} />
          {wallet ? 'Update Wallet' : 'Add Wallet'}
        </button>
      </div>
    </form>
  );
};