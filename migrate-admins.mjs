import mysql from 'mysql2/promise';
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
    await pool.query("ALTER TABLE sac_admins ADD COLUMN role VARCHAR(20) DEFAULT 'admin'");
    console.log("✅ Added role column.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log("⚠️ role column already exists.");
    else console.log("Error adding role:", err.message);
  }

  try {
    await pool.query("ALTER TABLE sac_admins ADD COLUMN club_name VARCHAR(255) NULL");
    console.log("✅ Added club_name column.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log("⚠️ club_name column already exists.");
    else console.log("Error adding club_name:", err.message);
  }
  
  process.exit(0);
}
run();
