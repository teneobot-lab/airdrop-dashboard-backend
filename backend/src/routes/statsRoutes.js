const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET /api/stats - Dashboard statistics
router.get('/', async (req, res, next) => {
  try {
    // Total projects
    const [projects] = await pool.execute('SELECT COUNT(*) as count FROM projects');
    const totalProjects = projects[0].count;

    // Active wallets
    const [wallets] = await pool.execute("SELECT COUNT(*) as count FROM wallets WHERE status = 'active'");
    const activeWallets = wallets[0].count;

    // Pending claims (projects with status = 'pending')
    const [pending] = await pool.execute("SELECT COUNT(*) as count FROM projects WHERE status = 'pending'");
    const pendingClaims = pending[0].count;

    // Upcoming claims (next 30 days)
    const [upcoming] = await pool.execute(`
      SELECT name as project_name, claim_date, estimated_reward, logo_emoji
      FROM projects
      WHERE claim_date IS NOT NULL
        AND claim_date >= CURDATE()
        AND claim_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
      ORDER BY claim_date ASC
      LIMIT 10
    `);

    // Recent activity count
    const [recentActivity] = await pool.execute(
      'SELECT COUNT(*) as count FROM activity_logs WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    );

    res.json({
      total_projects: totalProjects,
      active_wallets: activeWallets,
      pending_claims: pendingClaims,
      upcoming_claims: upcoming,
      recent_activity_count: recentActivity[0].count
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;