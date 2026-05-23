import { useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/walletService';
import type { Wallet, CreateWalletInput } from '../types';

interface UseWalletsReturn {
  wallets: Wallet[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createWallet: (data: CreateWalletInput) => Promise<Wallet>;
  updateWallet: (id: number, data: Partial<CreateWalletInput>) => Promise<Wallet>;
  deleteWallet: (id: number) => Promise<void>;
}

export const useWallets = (): UseWalletsReturn => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.getAll();
      setWallets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  const createWallet = async (data: CreateWalletInput): Promise<Wallet> => {
    const newWallet = await walletService.create(data);
    setWallets(prev => [newWallet, ...prev]);
    return newWallet;
  };

  const updateWallet = async (id: number, data: Partial<CreateWalletInput>): Promise<Wallet> => {
    const updated = await walletService.update(id, data);
    setWallets(prev => prev.map(w => w.id === id ? { ...w, ...updated } : w));
    return updated;
  };

  const deleteWallet = async (id: number): Promise<void> => {
    await walletService.delete(id);
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  return { wallets, loading, error, refetch: fetchWallets, createWallet, updateWallet, deleteWallet };
};