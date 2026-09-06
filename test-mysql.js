const pool = require('./lib/db');
async function run() {
  try {
    const [rows, fields] = await pool.query("DESCRIBE clubs");
    console.log(rows);
  } catch (err) {
    console.log("Error:", err);
  }
  process.exit(0);
}
run();
