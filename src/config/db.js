const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'db', 'data.sqlite');
const Database = require('better-sqlite3');
const db = new Database('/data/app.db');
db.pragma('journal_mode = WAL');

module.exports = db;
