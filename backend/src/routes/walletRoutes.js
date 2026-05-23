const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { logActivity } = require('../db/activityLogger');

// GET /api/wallets - List all wallets
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT w.*, COUNT(pw.project_id) as project_count
      FROM wallets w
      LEFT JOIN project_wallets pw ON w.id = pw.wallet_id
      GROUP BY w.id
      ORDER BY w.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/wallets/:id - Get single wallet with linked projects
router.get('/:id', async (req, res, next) => {
  try {
    const [wallet] = await pool.execute(
      'SELECT * FROM wallets WHERE id = ?',
      [req.params.id]
    );

    if (wallet.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const [projects] = await pool.execute(`
      SELECT p.* FROM projects p
      JOIN project_wallets pw ON p.id = pw.project_id
      WHERE pw.wallet_id = ?
    `, [req.params.id]);

    res.json({ ...wallet[0], projects });
  } catch (error) {
    next(error);
  }
});

// POST /api/wallets - Create wallet
router.post('/', async (req, res, next) => {
  try {
    const { label, address, network = 'ETH', balance = 0, status = 'active', notes } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO wallets (label, address, network, balance, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [label || '', address, network, balance, status, notes || '']
    );

    await logActivity('add_wallet', 'wallet', result.insertId, `Added wallet ${label || address.slice(0, 10)}...`);

    const [newWallet] = await pool.execute('SELECT * FROM wallets WHERE id = ?', [result.insertId]);
    res.status(201).json(newWallet[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/wallets/:id - Update wallet
router.put('/:id', async (req, res, next) => {
  try {
    const { label, address, network, balance, status, notes } = req.body;

    const [existing] = await pool.execute('SELECT * FROM wallets WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    await pool.execute(`
      UPDATE wallets SET
        label = COALESCE(?, label),
        address = COALESCE(?, address),
        network = COALESCE(?, network),
        balance = COALESCE(?, balance),
        status = COALESCE(?, status),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `, [label, address, network, balance, status, notes, req.params.id]);

    await logActivity('update_wallet', 'wallet', req.params.id, `Updated wallet ${label || address?.slice(0, 10) || existing[0].label}`);

    const [updated] = await pool.execute('SELECT * FROM wallets WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/wallets/:id - Delete wallet
router.delete('/:id', async (req, res, next) => {
  try {
    const [existing] = await pool.execute('SELECT * FROM wallets WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    await pool.execute('DELETE FROM wallets WHERE id = ?', [req.params.id]);
    await logActivity('delete', 'wallet', req.params.id, `Deleted wallet ${existing[0].label || existing[0].address.slice(0, 10)}...`);

    res.json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;