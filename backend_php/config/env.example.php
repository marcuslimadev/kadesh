<?php
/**
 * Configurações de Ambiente - EXEMPLO
 * 
 * Copie este arquivo para env.php e configure:
 * cp env.example.php env.php
 */

// ============ DATABASE ============
// Desenvolvimento local (XAMPP)
putenv('DB_HOST=localhost');
putenv('DB_PORT=3306');
putenv('DB_NAME=kadesh');
putenv('DB_USER=root');
putenv('DB_PASSWORD=');

// Produção Hostinger (descomentar e configurar)
// putenv('DB_NAME=u123456789_kadesh');
// putenv('DB_USER=u123456789_kadesh');
// putenv('DB_PASSWORD=sua_senha_mysql');

// ============ AMBIENTE ============
putenv('APP_ENV=development');
putenv('APP_DEBUG=true');

// ============ JWT ============
// IMPORTANTE: Gere uma chave forte para produção
// php -r "echo bin2hex(random_bytes(64));"
putenv('JWT_SECRET=sua_chave_secreta_aqui_minimo_64_caracteres');
putenv('JWT_EXPIRES_IN=604800'); // 7 dias em segundos

// ============ CORS ============
putenv('FRONTEND_URL=http://localhost:3000');

// ============ MERCADO PAGO ============
// putenv('MP_ACCESS_TOKEN=TEST-seu_access_token');
// putenv('MP_PUBLIC_KEY=TEST-sua_public_key');

// ============ UPLOAD ============
putenv('MAX_FILE_SIZE=10485760'); // 10MB
putenv('UPLOAD_PATH=' . __DIR__ . '/../uploads');

// ============ PLATFORM ============
putenv('PLATFORM_FEE_PERCENT=10');
