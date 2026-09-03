const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.production' });
async function run() {
  const conn = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  const [rows] = await conn.query('SELECT COUNT(*) as c FROM activities');
  console.log(rows[0].c);
  conn.end();
}
run();
