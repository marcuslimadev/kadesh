const bcrypt = require('bcryptjs');

const password = 'Teste@123';
const hash = bcrypt.hashSync(password, 10);

console.log('\n🔑 Hash gerado para senha: Teste@123');
console.log('\n' + hash);
console.log('\n📋 INSERT SQL pronto para usar:\n');
console.log(`INSERT INTO users (email, password, name, type, is_admin, created_at, updated_at)
VALUES (
  'kaddesh@kaddesh.com',
  '${hash}',
  'Administrador Kaddesh',
  'client',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password,
    is_admin = true,
    updated_at = NOW();`);
