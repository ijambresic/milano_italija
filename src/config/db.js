const { Pool } = require('pg');

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

module.exports = pool;