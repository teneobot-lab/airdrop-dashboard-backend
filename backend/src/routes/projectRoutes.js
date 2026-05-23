const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { logActivity } = require('../db/activityLogger');

// GET /api/projects - List all projects with wallet count
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, COUNT(pw.wallet_id) as wallet_count
      FROM projects p
      LEFT JOIN project_wallets pw ON p.id = pw.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get project with linked wallets
router.get('/:id', async (req, res, next) => {
  try {
    const [project] = await pool.execute(
      'SELECT * FROM projects WHERE id = ?',
      [req.params.id]
    );

    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const [wallets] = await pool.execute(`
      SELECT w.* FROM wallets w
      JOIN project_wallets pw ON w.id = pw.wallet_id
      WHERE pw.project_id = ?
    `, [req.params.id]);

    res.json({ ...project[0], wallets });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Create project
router.post('/', async (req, res, next) => {
  try {
    const { name, logo_emoji, network, status, estimated_reward, reward_token, claim_date, website_url, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO projects (name, logo_emoji, network, status, estimated_reward, reward_token, claim_date, website_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, logo_emoji || '🪙', network || 'ETH', status || 'pending', estimated_reward || null, reward_token || '', claim_date || null, website_url || '', notes || '']
    );

    await logActivity('add_project', 'project', result.insertId, `Added ${name} airdrop project`);

    const [newProject] = await pool.execute('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(newProject[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res, next) => {
  try {
    const { name, logo_emoji, network, status, estimated_reward, reward_token, claim_date, website_url, notes } = req.body;

    const [existing] = await pool.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await pool.execute(`
      UPDATE projects SET
        name = COALESCE(?, name),
        logo_emoji = COALESCE(?, logo_emoji),
        network = COALESCE(?, network),
        status = COALESCE(?, status),
        estimated_reward = COALESCE(?, estimated_reward),
        reward_token = COALESCE(?, reward_token),
        claim_date = COALESCE(?, claim_date),
        website_url = COALESCE(?, website_url),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `, [name, logo_emoji, network, status, estimated_reward, reward_token, claim_date, website_url, notes, req.params.id]);

    await logActivity('update_project', 'project', req.params.id, `Updated ${name || existing[0].name}`);

    const [updated] = await pool.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json(updated[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res, next) => {
  try {
    const [existing] = await pool.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await pool.execute('DELETE FROM projects WHERE id = ?', [req.params.id]);
    await logActivity('delete', 'project', req.params.id, `Deleted project ${existing[0].name}`);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects/:id/wallets - Link wallet to project
router.post('/:id/wallets', async (req, res, next) => {
  try {
    const { wallet_id } = req.body;

    if (!wallet_id) {
      return res.status(400).json({ error: 'wallet_id is required' });
    }

    // Check project exists
    const [project] = await pool.execute('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (project.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check wallet exists
    const [wallet] = await pool.execute('SELECT * FROM wallets WHERE id = ?', [wallet_id]);
    if (wallet.length === 0) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    await pool.execute(
      'INSERT IGNORE INTO project_wallets (project_id, wallet_id) VALUES (?, ?)',
      [req.params.id, wallet_id]
    );

    await logActivity('link_wallet', 'project', req.params.id, `Linked wallet ${wallet[0].label || wallet[0].address.slice(0, 10)} to ${project[0].name}`);

    res.status(201).json({ message: 'Wallet linked successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:id/wallets/:walletId - Unlink wallet from project
router.delete('/:id/wallets/:walletId', async (req, res, next) => {
  try {
    await pool.execute(
      'DELETE FROM project_wallets WHERE project_id = ? AND wallet_id = ?',
      [req.params.id, req.params.walletId]
    );

    await logActivity('delete', 'project', req.params.id, `Unlinked wallet from project`);

    res.json({ message: 'Wallet unlinked successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;