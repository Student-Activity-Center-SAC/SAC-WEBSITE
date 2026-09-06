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
  // Show current state
  const [rows] = await pool.query("SELECT id, username, name, role, club_name FROM sac_admins");
  console.log("Current users:", rows);

  // Fix dev user
  const devUser = process.env.ADMIN_SQL_USER || '2400030188';
  await pool.query("UPDATE sac_admins SET role = 'admin', club_name = NULL WHERE username = ?", [devUser]);
  console.log(`\n✅ Fixed: Set role='admin' for user '${devUser}'`);
  
  const [updated] = await pool.query("SELECT id, username, name, role, club_name FROM sac_admins WHERE username = ?", [devUser]);
  console.log("Updated:", updated);
  
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
