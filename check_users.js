import pool from './server/db.js';

(async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_users');
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
