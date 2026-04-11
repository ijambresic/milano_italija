const { Pool } = require('pg');


const isProduction = process.env.NODE_ENV === 'production';
let pool;

if (isProduction) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
} else {
  const pool = new Pool({
  user: 'postgres',
  host: 'metro.proxy.rlwy.net',
  database: 'railway',        
  password: 'DBXKhVifdfxIebVUGRWHltihZvdUcxxR',
  port: 29137,                
  ssl: {
    rejectUnauthorized: false
  }
});
}

module.exports = pool;