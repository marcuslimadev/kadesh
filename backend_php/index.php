<?php
// Carregar configurações de ambiente
if (file_exists(__DIR__ . '/config/env.php')) {
    require_once __DIR__ . '/config/env.php';
}

// Configurações globais
error_reporting(E_ALL);
ini_set('display_errors', getenv('APP_DEBUG') === 'true' ? 1 : 0);
date_default_timezone_set('America/Sao_Paulo');

// CORS - Ler do ambiente ou usar padrões
$envOrigins = getenv('FRONTEND_URL') ?: '';
$allowedOrigins = array_filter(array_map('trim', explode(',', $envOrigins)));

// Fallback para desenvolvimento
if (empty($allowedOrigins)) {
    $allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173'
    ];
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Roteamento simples
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remover prefixo /api se existir
$path = preg_replace('/^\/api/', '', $requestUri);

// Mapeamento de rotas para arquivos
$routes = [
    '/auth/register' => 'api/auth/register.php',
    '/auth/login' => 'api/auth/login.php',
    '/auth/verify' => 'api/auth/verify.php',
    '/projects' => 'api/projects/index.php',
    '/users/dashboard/stats' => 'api/users/stats.php',
    '/health' => 'health.php'
];

// Verificar rotas dinâmicas (ex: /projects/123)
if (isset($routes[$path])) {
    require_once __DIR__ . '/' . $routes[$path];
} else {
    // Lógica para rotas com parâmetros ou 404
    if (preg_match('/^\/projects\/([^\/]+)$/', $path, $matches)) {
        $_GET['id'] = $matches[1];
        require_once __DIR__ . '/api/projects/detail.php';
    } else {
        header("Content-Type: application/json");
        http_response_code(404);
        echo json_encode(['error' => 'Rota não encontrada', 'path' => $path]);
    }
}
