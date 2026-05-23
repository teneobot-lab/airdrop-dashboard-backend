export type Network = 'ETH' | 'BSC' | 'SOL' | 'ARB' | 'OP' | 'BASE' | 'OTHER';
export type WalletStatus = 'active' | 'inactive';
export type ProjectStatus = 'active' | 'pending' | 'completed' | 'watchlist';
export type ActionType = 'claim' | 'add_wallet' | 'add_project' | 'update_project' | 'update_wallet' | 'delete';

export interface Wallet {
  id: number;
  label: string;
  address: string;
  network: Network;
  balance: number;
  status: WalletStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  project_count?: number;
  projects?: Project[];
}

export interface Project {
  id: number;
  name: string;
  logo_emoji: string;
  network: Network;
  status: ProjectStatus;
  estimated_reward: number | null;
  reward_token: string;
  claim_date: string | null;
  website_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
  wallet_count?: number;
  wallets?: Wallet[];
}

export interface ActivityLog {
  id: number;
  action_type: ActionType;
  entity_type: 'project' | 'wallet';
  entity_id: number | null;
  description: string;
  created_at: string;
}

export interface Stats {
  total_projects: number;
  active_wallets: number;
  pending_claims: number;
  upcoming_claims: Array<{
    project_name: string;
    claim_date: string;
    estimated_reward: number | null;
    logo_emoji: string;
  }>;
  recent_activity_count: number;
}

export interface CreateWalletInput {
  label: string;
  address: string;
  network: Network;
  balance?: number;
  status?: WalletStatus;
  notes?: string;
}

export interface CreateProjectInput {
  name: string;
  logo_emoji?: string;
  network?: Network;
  status?: ProjectStatus;
  estimated_reward?: number;
  reward_token?: string;
  claim_date?: string;
  website_url?: string;
  notes?: string;
}