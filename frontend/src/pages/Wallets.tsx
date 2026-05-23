import React, { useState, useEffect } from 'react';
import { Plus, Search, Wallet as WalletIcon, Upload } from 'lucide-react';
import { useWallets } from '../hooks/useWallets';
import { useToast } from '../components/Toast';
import { WalletCard } from '../components/WalletCard';
import { Modal } from '../components/Modal';
import { WalletForm } from '../components/WalletForm';
import { ImportWalletsForm } from '../components/ImportWalletsForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { WalletCardSkeleton } from '../components/Skeleton';
import type { Wallet, CreateWalletInput, Network } from '../types';

export const Wallets: React.FC = () => {
  const { wallets, loading, error, createWallet, updateWallet, deleteWallet } = useWallets();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterNetwork, setFilterNetwork] = useState<Network | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

  // Check for ?new=true query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === 'true') {
      setIsModalOpen(true);
      window.history.replaceState({}, '', '/wallets');
    }
  }, []);

  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      wallet.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNetwork = filterNetwork === 'all' || wallet.network === filterNetwork;
    return matchesSearch && matchesNetwork;
  });

  const handleSubmit = async (data: CreateWalletInput) => {
    try {
      if (editingWallet) {
        await updateWallet(editingWallet.id, data);
        showToast('success', 'Wallet updated successfully');
      } else {
        await createWallet(data);
        showToast('success', 'Wallet added successfully');
      }
      setIsModalOpen(false);
      setEditingWallet(null);
    } catch (err) {
      showToast('error', 'Failed to save wallet');
    }
  };

  const handleImport = async (addresses: string[]) => {
    try {
      let successCount = 0;
      for (const address of addresses) {
        const result = await createWallet({
          address,
          label: `${address.slice(0, 8)}...`,
          network: detectNetwork(address),
        });
        successCount++;
      }
      showToast('success', `Imported ${successCount} wallet${successCount !== 1 ? 's' : ''}`);
      setIsImportModalOpen(false);
    } catch (err) {
      showToast('error', 'Failed to import wallets');
    }
  };

  const detectNetwork = (address: string): Network => {
    if (address.length > 40) return 'SOL';
    if (address.startsWith('0x')) return 'ETH';
    return 'ETH';
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const wallet = wallets.find(w => w.id === id);
    if (wallet) {
      setDeleteConfirm({ id, name: wallet.label || wallet.address.slice(0, 10) + '...' });
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteWallet(deleteConfirm.id);
        showToast('success', 'Wallet deleted');
        setDeleteConfirm(null);
      } catch (err) {
        showToast('error', 'Failed to delete wallet');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Wallets</h1>
          <p className="text-gray-500 text-sm mt-1">
            {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} connected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            onClick={() => { setEditingWallet(null); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Wallet</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wallets..."
              className="input-field pl-10"
            />
          </div>

          <select
            value={filterNetwork}
            onChange={(e) => setFilterNetwork(e.target.value as Network | 'all')}
            className="input-field w-auto"
          >
            <option value="all">All Networks</option>
            <option value="ETH">Ethereum</option>
            <option value="BSC">BNB Chain</option>
            <option value="SOL">Solana</option>
            <option value="ARB">Arbitrum</option>
            <option value="OP">Optimism</option>
            <option value="BASE">Base</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Wallets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <WalletCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      ) : filteredWallets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWallets.map((wallet, index) => (
            <div key={wallet.id} style={{ animationDelay: `${index * 50}ms` }}>
              <WalletCard
                wallet={wallet}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No wallets found"
          description={searchQuery ? "Try adjusting your search or filters" : "Add your first wallet to start tracking"}
          actionLabel={!searchQuery ? "Add Wallet" : undefined}
          onAction={!searchQuery ? () => setIsModalOpen(true) : undefined}
          icon={<WalletIcon size={48} />}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingWallet(null); }}
        title={editingWallet ? 'Edit Wallet' : 'Add Wallet'}
        size="md"
      >
        <WalletForm
          wallet={editingWallet || undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setIsModalOpen(false); setEditingWallet(null); }}
        />
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Wallets"
        size="md"
      >
        <ImportWalletsForm
          onImport={handleImport}
          onCancel={() => setIsImportModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Wallet"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        variant="danger"
      />

      {/* FAB for mobile */}
      <button
        onClick={() => { setEditingWallet(null); setIsModalOpen(true); }}
        className="fixed bottom-24 right-6 md:hidden w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};