import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

interface ImportWalletsFormProps {
  onImport: (addresses: string[]) => void;
  onCancel: () => void;
}

export const ImportWalletsForm: React.FC<ImportWalletsFormProps> = ({ onImport, onCancel }) => {
  const [addresses, setAddresses] = useState('');

  const handleImport = () => {
    const lines = addresses
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length > 0) {
      onImport(lines);
    }
  };

  const count = addresses
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0).length;

  return (
    <div className="space-y-5">
      <div>
        <label className="label">Wallet Addresses</label>
        <p className="text-sm text-gray-500 mb-3">
          Enter one wallet address per line. Labels will be auto-generated.
        </p>
        <textarea
          value={addresses}
          onChange={(e) => setAddresses(e.target.value)}
          className="input-field font-mono text-sm resize-none h-48"
          placeholder={`0x742d35Cc6634C0532925a3b844Bc9e7595f8fE12\n0x8f3a2b5c6d7e9f1a2b3c4d5e6f7a8b9c0d1e2f3a\n7v1N2K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C`}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-cream-50 rounded-xl">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-amber-600" />
          <span className="text-sm font-medium text-gray-700">
            {count} wallet{count !== 1 ? 's' : ''} detected
          </span>
        </div>
        {count > 0 && (
          <span className="text-xs text-gray-500">Ready to import</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={count === 0}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Import {count > 0 ? `${count} Wallets` : 'Wallets'}
        </button>
      </div>
    </div>
  );
};