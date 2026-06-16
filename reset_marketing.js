import pool from './server/db.js';
import bcrypt from 'bcryptjs';

(async () => {
  try {
    const password = 'marketing2026';
    const hash = await bcrypt.hash(password, 10);
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE role="marketing"');
    
    if (rows.length > 0) {
      await pool.query('UPDATE admin_users SET password_hash = ?, username = ? WHERE role="marketing"', [hash, 'marketing']);
      console.log('--- SUCESSO ---');
      console.log('Senha do usuario "marketing" (role: marketing) foi resetada para:', password);
    } else {
      await pool.query('INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)', ['marketing', hash, 'marketing']);
      console.log('--- SUCESSO ---');
      console.log('Usuario "marketing" criado com a senha:', password);
    }
  } catch (err) {
    console.error('Erro ao resetar senha:', err);
  } finally {
    process.exit(0);
  }
})();
