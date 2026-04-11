const pool = require('../config/db');

async function findUserById(id) {
  const { rows } = await pool.query('SELECT id, username, role, currency, password_hash FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function findUserByUsername(username) {
  const { rows } = await pool.query('SELECT id, username, role, currency, password_hash FROM users WHERE username = $1', [username]);
  return rows[0];
}

module.exports = {
  findUserById,
  findUserByUsername
};
