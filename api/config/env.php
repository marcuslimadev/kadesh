<?php
/**
 * Configuracoes de Ambiente - Producao Hostinger
 */

// ============ DATABASE ============
putenv('DB_HOST=localhost');
putenv('DB_PORT=3306');
putenv('DB_NAME=u912059534_kadesh');
putenv('DB_USER=u912059534_kadesh');
putenv('DB_PASSWORD=MundoMelhor@10');

// ============ AMBIENTE ============
putenv('APP_ENV=production');
putenv('APP_DEBUG=false');

// ============ JWT ============
putenv('JWT_SECRET=8827f0f6bd3535ae7de20e35b46499e906da9745360e9bbc7ce7aac4a100c507eeeb1d952cfc5ce590d903f96575e688abdbe2b9219da55819383e320c182416');
putenv('JWT_EXPIRES_IN=604800');

// ============ CORS ============
putenv('FRONTEND_URL=https://darkorchid-ferret-999896.hostingersite.com');

// ============ UPLOAD ============
putenv('MAX_FILE_SIZE=10485760');
putenv('UPLOAD_PATH=/home/u912059534/domains/darkorchid-ferret-999896.hostingersite.com/public_html/api/uploads');

// ============ PLATFORM ============
putenv('PLATFORM_FEE_PERCENT=10');
