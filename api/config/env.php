<?php
/**
 * Configurações de Ambiente - Produção Hostinger
 * 
 * IMPORTANTE: Este arquivo NÃO deve ser commitado no git!
 * Adicione ao .gitignore: backend_php/config/env.php
 */

// ============ DATABASE ============
putenv('DB_HOST=localhost');
putenv('DB_PORT=3306');
putenv('DB_NAME=u123456789_kadesh');
putenv('DB_USER=u123456789_kadesh');
putenv('DB_PASSWORD=SUA_SENHA_MYSQL');

// ============ AMBIENTE ============
putenv('APP_ENV=production');
putenv('APP_DEBUG=false');

// ============ JWT ============
putenv('JWT_SECRET=8c67c74610f123101fa3fa4823356be1d5dcaadf1891d391cdf75424b681d3827675cf9cee0e121c3d949ef8da0df8505d04694bb36b26f0bef379d472edf0d7');
putenv('JWT_EXPIRES_IN=604800'); // 7 dias em segundos

// ============ CORS ============
// Separar múltiplos domínios por vírgula
putenv('FRONTEND_URL=https://www.seudominio.com.br,https://seudominio.com.br');

// ============ MERCADO PAGO ============
// Descomentar quando ativar pagamentos
// putenv('MP_ACCESS_TOKEN=seu_access_token_producao');
// putenv('MP_PUBLIC_KEY=sua_public_key_producao');
// putenv('MP_WEBHOOK_SECRET=seu_webhook_secret');

// ============ UPLOAD ============
putenv('MAX_FILE_SIZE=10485760'); // 10MB
putenv('UPLOAD_PATH=/home/u123456789/public_html/api/uploads');

// ============ PLATFORM ============
putenv('PLATFORM_FEE_PERCENT=10');
