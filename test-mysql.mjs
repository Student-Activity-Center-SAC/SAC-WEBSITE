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
    const [rows] = await pool.query("DESCRIBE clubs");
    console.log(rows);
  } catch (err) {
    console.log("Error:", err);
  }
  process.exit(0);
}
run();
