const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || '/data/database.sqlite';
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

module.exports = db;