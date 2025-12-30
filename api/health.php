<?php
/**
 * Health Check Endpoint
 * GET /health ou /api/health
 */

header('Content-Type: application/json');

// Carregar config se não carregado
if (!getenv('DB_HOST')) {
    if (file_exists(__DIR__ . '/config/env.php')) {
        require_once __DIR__ . '/config/env.php';
    }
}

require_once __DIR__ . '/config/database.php';

$response = [
    'status' => 'ok',
    'timestamp' => date('c'),
    'environment' => getenv('APP_ENV') ?: 'development',
    'php_version' => PHP_VERSION
];

// Testar conexão com banco
try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if ($conn) {
        $response['database'] = 'connected';
    } else {
        $response['database'] = 'disconnected';
        $response['status'] = 'degraded';
    }
} catch (Exception $e) {
    $response['database'] = 'error';
    $response['database_error'] = $e->getMessage();
    $response['status'] = 'unhealthy';
    http_response_code(503);
}

echo json_encode($response, JSON_PRETTY_PRINT);
