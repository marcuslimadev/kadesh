<?php
/**
 * Configurações de Ambiente - Desenvolvimento Local
 */

// ============ DATABASE ============
// Banco de dados de PRODUÇÃO (Hostinger) - acesso remoto liberado
putenv('DB_HOST=193.203.175.250');
putenv('DB_PORT=3306');
putenv('DB_NAME=u912059534_kadesh');
putenv('DB_USER=u912059534_kadesh');
putenv('DB_PASSWORD=MundoMelhor@10');

// ============ AMBIENTE ============
putenv('APP_ENV=development');
putenv('APP_DEBUG=true');

// ============ JWT ============
putenv('JWT_SECRET=dev_secret_key_change_in_production_min_32_chars');
putenv('JWT_EXPIRATION=86400'); // 24 horas

// ============ FRONTEND ============
putenv('FRONTEND_URL=http://localhost:3001');
putenv('FRONTEND_URLS=http://localhost:3001,http://localhost:3000,http://localhost:5173,http://127.0.0.1:3001,http://127.0.0.1:5173');

// ============ CORS ============
putenv('CORS_ALLOW_CREDENTIALS=true');

// ============ MERCADO PAGO (Sandbox) ============
putenv('MP_ACCESS_TOKEN=TEST-YOUR-ACCESS-TOKEN');
putenv('MP_PUBLIC_KEY=TEST-YOUR-PUBLIC-KEY');
putenv('MP_WEBHOOK_SECRET=your_webhook_secret');

// ============ EMAIL ============
putenv('MAIL_HOST=smtp.mailtrap.io');
putenv('MAIL_PORT=2525');
putenv('MAIL_USERNAME=');
putenv('MAIL_PASSWORD=');
putenv('MAIL_FROM=noreply@kadesh.local');
putenv('MAIL_FROM_NAME=Kadesh Platform');

// ============ STORAGE ============
putenv('UPLOAD_MAX_SIZE=5242880'); // 5MB
putenv('UPLOAD_PATH=uploads/');
