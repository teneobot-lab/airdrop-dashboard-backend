const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET /api/activity - List activity logs
router.get('/', async (req, res, next) => {
  try {
    const { limit = 20, type } = req.query;
    let query = 'SELECT * FROM activity_logs';
    const params = [];

    if (type) {
      query += ' WHERE action_type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;