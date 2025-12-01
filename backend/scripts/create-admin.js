const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://kadesh:kadesh@localhost:5432/kadesh'
});

async function createAdmin() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('\n🔧 Hash gerado:', hash);
    
    await pool.query(
      `INSERT INTO admin_users (username, email, password_hash, name, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = $3, updated_at = NOW()`,
      ['admin', 'admin@kadesh.local', hash, 'Administrador', 'super_admin']
    );
    
    const result = await pool.query(
      'SELECT email, name, role, substring(password_hash, 1, 10) as hash_preview FROM admin_users WHERE email = $1',
      ['admin@kadesh.local']
    );
    
    console.log('\n✅ Admin user criado/atualizado!');
    console.log(result.rows[0]);
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

createAdmin();
