const db = require('../config/db');

function findUserById(id) {
  return db.prepare('SELECT id, username, role, currency, password_hash FROM users WHERE id = ?').get(id);
}

function findUserByUsername(username) {
  return db.prepare('SELECT id, username, role, currency, password_hash FROM users WHERE username = ?').get(username);
}

module.exports = {
  findUserById,
  findUserByUsername
};
