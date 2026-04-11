const { Pool } = require('pg');


const isProduction = process.env.NODE_ENV === 'production';
let pool;

if (isProduction) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'a',
    port: 5432,
    ssl: false
  });
}

module.exports = pool;