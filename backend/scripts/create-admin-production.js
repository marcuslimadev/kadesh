const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Usar DATABASE_URL do ambiente ou fornecida como argumento
const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não fornecida!');
  console.log('\nUso:');
  console.log('  DATABASE_URL=postgresql://... node create-admin-production.js');
  console.log('  ou');
  console.log('  node create-admin-production.js "postgresql://..."');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para Render/Heroku
  }
});

async function createAdminProduction() {
  try {
    console.log('\n🔐 Criando administrador em PRODUÇÃO...\n');

    // Dados do novo admin
    const email = 'kaddesh@kaddesh.com';
    const password = 'Teste@123';
    const name = 'Administrador Kaddesh';

    // Gerar hash da senha
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ Hash da senha gerado');

    // Verificar se usuário já existe
    const existingUser = await pool.query(
      'SELECT id, email, is_admin FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Atualizar usuário existente para admin
      await pool.query(
        `UPDATE users 
         SET password = $1, 
             is_admin = true,
             name = $2,
             updated_at = NOW()
         WHERE email = $3`,
        [hash, name, email]
      );
      console.log(`✅ Usuário ${email} atualizado para administrador`);
    } else {
      // Criar novo usuário admin
      await pool.query(
        `INSERT INTO users (email, password, name, type, is_admin, created_at, updated_at)
         VALUES ($1, $2, $3, 'client', true, NOW(), NOW())`,
        [email, hash, name]
      );
      console.log(`✅ Novo administrador ${email} criado`);
    }

    // Verificar resultado
    const result = await pool.query(
      `SELECT id, email, name, type, is_admin, created_at 
       FROM users 
       WHERE email = $1`,
      [email]
    );

    console.log('\n📋 Dados do administrador:');
    console.log(result.rows[0]);
    console.log('\n🔑 Credenciais de acesso:');
    console.log(`   Email: ${email}`);
    console.log(`   Senha: ${password}`);
    console.log('\n🌐 URL de login:');
    console.log('   https://kadesh-two.vercel.app/admin/login');
    console.log('   (ou use /login e faça login normalmente)');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.error(error);
  } finally {
    await pool.end();
    console.log('\n✅ Conexão com banco de dados fechada');
  }
}

createAdminProduction();
