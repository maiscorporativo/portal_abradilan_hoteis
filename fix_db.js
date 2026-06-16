import pool from './server/db.js';

(async () => {
  try {
    console.log('Alterando a tabela admin_users para permitir a role marketing...');
    await pool.query("ALTER TABLE admin_users MODIFY COLUMN role ENUM('admin','master','marketing') NOT NULL DEFAULT 'admin'");
    
    console.log('Atualizando o usuario marketing para ter a role correta...');
    await pool.query("UPDATE admin_users SET role = 'marketing' WHERE username = 'marketing'");
    
    console.log('--- SUCESSO ---');
    console.log('O banco de dados foi corrigido! O usuario marketing agora tem a permissão correta.');
  } catch (err) {
    console.error('Erro ao corrigir o banco:', err);
  } finally {
    process.exit(0);
  }
})();
