-- Airdrop Dashboard Database Schema
-- Run this SQL to set up the database

CREATE DATABASE IF NOT EXISTS airdrop_dashboard;
USE airdrop_dashboard;

-- Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100),
    address VARCHAR(255) NOT NULL UNIQUE,
    network ENUM('ETH','BSC','SOL','ARB','OP','BASE','OTHER') DEFAULT 'ETH',
    balance DECIMAL(18,8) DEFAULT 0,
    status ENUM('active','inactive') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_network (network),
    INDEX idx_status (status)
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    logo_emoji VARCHAR(10) DEFAULT '🪙',
    network ENUM('ETH','BSC','SOL','ARB','OP','BASE','OTHER') DEFAULT 'ETH',
    status ENUM('active','pending','completed','watchlist') DEFAULT 'pending',
    estimated_reward DECIMAL(18,2),
    reward_token VARCHAR(50),
    claim_date DATE,
    website_url VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_network (network),
    INDEX idx_claim_date (claim_date)
);

-- Project-Wallet Junction Table
CREATE TABLE IF NOT EXISTS project_wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    wallet_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_pair (project_id, wallet_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_wallet_id (wallet_id)
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_type ENUM('claim','add_wallet','add_project','update_project','update_wallet','delete') NOT NULL,
    entity_type ENUM('project','wallet') NOT NULL,
    entity_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- SAMPLE SEED DATA
-- ============================================

-- Sample Wallets (4 wallets)
INSERT INTO wallets (label, address, network, balance, status, notes) VALUES
('MetaMask Main', '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE12', 'ETH', 1.23456789, 'active', 'Primary trading wallet'),
('MetaMask Dev', '0x8f3a2b5c6d7e9f1a2b3c4d5e6f7a8b9c0d1e2f3a', 'ETH', 0.56789012, 'active', 'Development & testing'),
('Phantom Wallet', '7v1N2K3L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C', 'SOL', 45.12345678, 'active', 'Solana DeFi activities'),
('BSC Wallet', '0xABC123def456GHI789jkl012MNO345pqr678STU901', 'BSC', 2.34567890, 'active', 'BSC farming & staking');

-- Sample Projects (5 projects)
INSERT INTO projects (name, logo_emoji, network, status, estimated_reward, reward_token, claim_date, website_url, notes) VALUES
('LayerZero', '🌉', 'ETH', 'pending', 2500.00, 'ZRO', '2026-06-15', 'https://layerzero.network', 'Multi-chain interoperability protocol. Need to bridge assets across 5+ chains.'),
('Starknet', '⚡', 'ETH', 'active', 5000.00, 'STRK', '2026-07-01', 'https://starknet.io', 'Ethereum L2. Active user since genesis. Large TVL requirement.'),
('zkSync Era', '🔮', 'ETH', 'pending', 3000.00, 'ZK', '2026-06-20', 'https://zksync.io', 'Matter Labs L2. Already claimed testnet. Mainnet activity required.'),
('Metis', '👑', 'OTHER', 'watchlist', 800.00, 'METIS', '2026-08-01', 'https://metis.io', 'Andromeda L2. Low activity chain. Check eligibility criteria.'),
('Jito', '🍃', 'SOL', 'active', 1200.00, 'JTO', '2026-05-30', 'https://jito.network', 'Solana MEV. Active validator engagement. High APY returns expected.');

-- Link wallets to projects
INSERT INTO project_wallets (project_id, wallet_id) VALUES
(1, 1), (1, 2), (2, 1), (2, 3),
(3, 1), (3, 2), (4, 4),
(5, 3);

-- Sample Activity Logs (10 logs)
INSERT INTO activity_logs (action_type, entity_type, entity_id, description, created_at) VALUES
('add_project', 'project', 1, 'Added LayerZero airdrop project', '2026-05-20 10:30:00'),
('add_wallet', 'wallet', 1, 'Added MetaMask Main wallet', '2026-05-20 10:25:00'),
('add_project', 'project', 2, 'Added Starknet airdrop project', '2026-05-21 09:15:00'),
('add_wallet', 'wallet', 3, 'Added Phantom Wallet', '2026-05-21 09:20:00'),
('update_project', 'project', 2, 'Updated status to active', '2026-05-22 14:00:00'),
('add_project', 'project', 3, 'Added zkSync Era project', '2026-05-22 16:30:00'),
('add_project', 'project', 3, 'Linked Phantom Wallet to zkSync Era', '2026-05-22 16:35:00'),
('add_project', 'project', 5, 'Added Jito airdrop project', '2026-05-23 08:00:00'),
('claim', 'project', 2, 'Marked Starknet as claimed - received 5000 STRK', '2026-05-23 11:00:00'),
('add_project', 'project', 4, 'Added Metis to watchlist', '2026-05-23 12:30:00');