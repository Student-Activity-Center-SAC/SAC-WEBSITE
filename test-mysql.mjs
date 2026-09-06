import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'sac',
});

async function run() {
  try {
    await pool.query("ALTER TABLE clubs ADD COLUMN sort_order INT DEFAULT 0");
    console.log("Added sort_order column successfully.");
    const [rows] = await pool.query("DESCRIBE clubs");
    console.log(rows.find(r => r.Field === 'sort_order'));
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("sort_order column already exists.");
    } else {
      console.log("Error:", err);
    }
  }
  process.exit(0);
}
run();
