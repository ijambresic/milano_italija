const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

/*
  Note: 'expired' and 'completed' quests will be removed from the database, so their statuses are not included in the schema.
*/

//there is only 1 user and 1 andmin, so we can simplify the database.
function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'player')),
      currency INTEGER NOT NULL DEFAULT 0
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      reward TEXT NOT NULL,
      max_reward INTEGER NOT NULL DEFAULT 0,
      achieved_reward INTEGER NOT NULL DEFAULT 0,
      deadline TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      event_start TEXT NOT NULL,
      event_end TEXT NOT NULL,
      reward TEXT NOT NULL,
      reward_achieved INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS shop_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'bought')),
      description TEXT,
      price INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS submitted_quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quest_id INTEGER NOT NULL,
      submission_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed')),
      new_reward INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (quest_id) REFERENCES quests(id)
    );
  `);

}

function seedUsers() {
  const existing = db.prepare('SELECT COUNT(*) AS count FROM users').get();
  if (existing.count > 0) return;

  const adminHash = bcrypt.hashSync('idemougrcku', 10);
  const playerHash = bcrypt.hashSync('2611', 10);

  db.prepare(`
    INSERT INTO users (username, password_hash, role, currency)
    VALUES
      (?, ?, 'admin', 0),
      (?, ?, 'player', 0)
  `).run('ivandasfs', adminHash, 'ena', playerHash);
}

// delete existing tables and data for a clean slate

/*
db.exec(`
  DROP TABLE IF EXISTS purchases;
  DROP TABLE IF EXISTS submitted_quests;
  DROP TABLE IF EXISTS shop_items;
  DROP TABLE IF EXISTS quests;
  DROP TABLE IF EXISTS events;
  DROP TABLE IF EXISTS users;
`);
*/
createTables();
seedUsers();
console.log('Database initialized.');
