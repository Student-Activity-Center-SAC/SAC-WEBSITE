import mysql from 'mysql2/promise';

// Local dev  → .env.local  (DB_HOST=localhost, DB_NAME=sac)
// Production → .env.production  (DB_HOST=localhost, DB_NAME=sac_new)
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'sac',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
