const pool = require('./connection');

const logActivity = async (actionType, entityType, entityId, description) => {
  try {
    await pool.execute(
      'INSERT INTO activity_logs (action_type, entity_type, entity_id, description) VALUES (?, ?, ?, ?)',
      [actionType, entityType, entityId, description]
    );
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

module.exports = { logActivity };