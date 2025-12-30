<?php
/**
 * Configurações de Produção - Hostinger
 * 
 * INSTRUÇÕES DE DEPLOY:
 * 1. Faça upload deste arquivo para o servidor via cPanel/FTP
 * 2. Renomeie para env.php (substituindo o existente)
 * 3. Preencha os valores reais nos campos marcados com [PREENCHER]
 * 
 * SEGURANÇA:
 * - NUNCA commit este arquivo com credenciais reais
 * - Gere JWT_SECRET único: php -r "echo bin2hex(random_bytes(64));"
 */

// ============ DATABASE (Hostinger MySQL) ============
putenv('DB_HOST=localhost');
putenv('DB_PORT=3306');
putenv('DB_NAME=[PREENCHER]');     // Ex: u123456789_kadesh
putenv('DB_USER=[PREENCHER]');     // Ex: u123456789_kadesh
putenv('DB_PASSWORD=[PREENCHER]'); // Senha do MySQL criada no cPanel

// ============ AMBIENTE ============
putenv('APP_ENV=production');
putenv('APP_DEBUG=false');

// ============ JWT ============
// GERE UMA CHAVE ÚNICA: php -r "echo bin2hex(random_bytes(64));"
putenv('JWT_SECRET=[PREENCHER]');
putenv('JWT_EXPIRES_IN=604800'); // 7 dias em segundos

// ============ CORS ============
// URL do frontend em produção (sem barra no final)
putenv('FRONTEND_URL=https://kadesh.com.br');

// ============ MERCADO PAGO (Produção) ============
putenv('MP_ACCESS_TOKEN=[PREENCHER]'); // Token de produção do MP
putenv('MP_PUBLIC_KEY=[PREENCHER]');   // Public key de produção

// ============ UPLOAD ============
putenv('MAX_FILE_SIZE=10485760'); // 10MB
putenv('UPLOAD_PATH=' . __DIR__ . '/../uploads');

// ============ PLATFORM ============
putenv('PLATFORM_FEE_PERCENT=10');

// ============ EMAIL (Hostinger SMTP) ============
putenv('MAIL_HOST=smtp.hostinger.com');
putenv('MAIL_PORT=465');
putenv('MAIL_USERNAME=[PREENCHER]'); // Ex: contato@kadesh.com.br
putenv('MAIL_PASSWORD=[PREENCHER]'); // Senha do email
putenv('MAIL_FROM_ADDRESS=contato@kadesh.com.br');
putenv('MAIL_FROM_NAME=Kadesh');
