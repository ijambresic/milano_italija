
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');
console.log('Connecting to:', process.env.DATABASE_URL);

/*
  Note: 'expired' and 'completed' quests will be removed from the database, so their statuses are not included in the schema.
*/

//there is only 1 user and 1 andmin, so we can simplify the database.
async function createTables() {
  console.log('Creating users table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'player')),
      currency INTEGER NOT NULL DEFAULT 0
    );
  `);
  console.log('Users table created.');

  console.log('Creating quests table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quests (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      reward TEXT NOT NULL,
      max_reward INTEGER NOT NULL DEFAULT 0,
      achieved_reward INTEGER NOT NULL DEFAULT 0,
      deadline TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Quests table created.');

  console.log('Creating events table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      event_start TEXT NOT NULL,
      event_end TEXT NOT NULL,
      reward TEXT NOT NULL,
      reward_achieved INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Events table created.');

  console.log('Creating shop_items table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shop_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'bought')),
      description TEXT,
      price INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log('Shop_items table created.');

  console.log('Creating submitted_quests table...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS submitted_quests (
      id SERIAL PRIMARY KEY,
      quest_id INTEGER NOT NULL REFERENCES quests(id),
      submission_time TIMESTAMP NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'reviewed')),
      new_reward INTEGER NOT NULL DEFAULT 0
    );
  `);
  console.log('Submitted_quests table created.');
}

async function seedUsers() {
  const { rows } = await pool.query('SELECT COUNT(*) AS count FROM users');
  if (rows[0].count > 0) return;

  const adminHash = bcrypt.hashSync('idemougrcku', 10);
  const playerHash = bcrypt.hashSync('2611', 10);

  await pool.query(
    `INSERT INTO users (username, password_hash, role, currency)
     VALUES ($1, $2, 'admin', 0), ($3, $4, 'player', 0)`,
    ['ivandasfs', adminHash, 'ena', playerHash]
  );
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
async function main() {
  try {
    // Test DB connection
    const { rows } = await pool.query('SELECT NOW()');
    console.log('Current time from DB:', rows[0]);
    await createTables();
    await seedUsers();
    console.log('Database initialized.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pool.end();
  }
}

main();
