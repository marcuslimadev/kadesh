<?php
/**
 * KADESH API - Main Router
 * Backend PHP para Hostinger
 */

// Carregar configurações de ambiente (prioriza produção válida)
$envProductionPath = __DIR__ . '/config/env.production.php';
if (file_exists($envProductionPath)) {
    $envProductionContent = file_get_contents($envProductionPath);
    if ($envProductionContent !== false && strpos($envProductionContent, '[PREENCHER]') === false) {
        require_once $envProductionPath;
    } elseif (file_exists(__DIR__ . '/config/env.php')) {
        require_once __DIR__ . '/config/env.php';
    } elseif (file_exists(__DIR__ . '/config/env.local.php')) {
        require_once __DIR__ . '/config/env.local.php';
    }
} elseif (file_exists(__DIR__ . '/config/env.php')) {
    require_once __DIR__ . '/config/env.php';
} elseif (file_exists(__DIR__ . '/config/env.local.php')) {
    require_once __DIR__ . '/config/env.local.php';
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
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Roteamento
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remover prefixos /kadesh/api ou apenas /api
$path = preg_replace('/^\/kadesh\/api/', '', $requestUri);
$path = preg_replace('/^\/api/', '', $path);
$path = rtrim($path, '/'); // Remover trailing slash

// ============================================
// ROTAS ESTÁTICAS (ordem importa!)
// ============================================
$staticRoutes = [
    // Health
    'GET:/health' => 'health.php',
    
        // Debug (dev)
        'GET:/debug-headers' => 'debug-headers.php',
    
    // Auth
    'POST:/auth/register' => 'api/auth/register.php',
    'POST:/auth/login' => 'api/auth/login.php',
    'GET:/auth/verify' => 'api/auth/verify.php',
    'POST:/auth/logout' => 'api/auth/logout.php',
    'POST:/auth/forgot-password' => 'api/auth/forgot-password.php',
    'POST:/auth/reset-password' => 'api/auth/reset-password.php',
    
    // Users
    'GET:/users/profile' => 'api/users/profile.php',
    'PUT:/users/profile' => 'api/users/update.php',
    'GET:/users/preferences' => 'api/users/preferences.php',
    'PUT:/users/preferences' => 'api/users/preferences.php',
    'GET:/users/dashboard/stats' => 'api/users/stats.php',
    
    // Projects
    'GET:/projects' => 'api/projects/index.php',
    'POST:/projects' => 'api/projects/create.php',
    'POST:/projects/test-create' => 'api/projects/test-create.php',
    'GET:/projects/my-projects' => 'api/projects/my-projects.php',
    'GET:/user/my-projects' => 'api/projects/my-projects.php',
    
    // Bids
    'GET:/bids/my-bids' => 'api/bids/my-bids.php',
    'GET:/user/my-bids' => 'api/bids/my-bids.php',
    'POST:/bids' => 'api/bids/create.php',
    
    // Contracts
    'GET:/contracts' => 'api/contracts/index.php',
    'POST:/contracts' => 'api/contracts/create.php',
    
    // Wallet
    'GET:/wallet/balance' => 'api/wallet/index.php',
    'GET:/wallet' => 'api/wallet/index.php',
    'GET:/wallet/transactions' => 'api/wallet/transactions.php',
    'POST:/wallet/deposit' => 'api/wallet/deposit.php',
    'POST:/wallet/withdraw' => 'api/wallet/withdraw.php',
    
    // Payments
    'GET:/payments/intents' => 'api/payments/index.php',
    'POST:/payments/deposit' => 'api/payments/mercadopago.php',
    'POST:/payments/mercadopago/webhook' => 'api/payments/webhook.php',
    
    // Notifications
    'GET:/notifications' => 'api/notifications/index.php',
    'POST:/notifications/read-all' => 'api/notifications/read.php',
    
    // Reviews
    'GET:/reviews' => 'api/reviews/index.php',
    'POST:/reviews' => 'api/reviews/create.php',
    
    // Advertisements
    'GET:/advertisements' => 'api/advertisements/index.php',
    'POST:/advertisements' => 'api/advertisements/create.php',
    
    // Admin
    'POST:/admin/login' => 'api/admin/login.php',
    'GET:/admin/stats/dashboard' => 'api/admin/dashboard.php',
    'GET:/admin/users' => 'api/admin/users.php',
    'GET:/admin/projects' => 'api/admin/projects.php',
    'GET:/admin/payments' => 'api/admin/payments.php',
    'GET:/admin/disputes' => 'api/admin/disputes.php',
    'GET:/admin/settings' => 'api/admin/settings.php',
    'PUT:/admin/settings' => 'api/admin/settings.php',
    'POST:/admin/settings' => 'api/admin/settings.php',
];

$routeKey = "$requestMethod:$path";

// Verificar rotas estáticas
if (isset($staticRoutes[$routeKey])) {
    require_once __DIR__ . '/' . $staticRoutes[$routeKey];
    exit;
}

// ============================================
// ROTAS DINÂMICAS (com parâmetros)
// ============================================
$dynamicRoutes = [
    // Projects
    ['GET', '/^\/projects\/([^\/]+)$/', 'api/projects/detail.php', 'id'],
    ['PUT', '/^\/projects\/([^\/]+)$/', 'api/projects/update.php', 'id'],
    ['DELETE', '/^\/projects\/([^\/]+)$/', 'api/projects/delete.php', 'id'],
    
    // Bids
    ['GET', '/^\/bids\/project\/([^\/]+)$/', 'api/bids/index.php', 'project_id'],
    ['PUT', '/^\/bids\/([^\/]+)$/', 'api/bids/update.php', 'id'],
    ['DELETE', '/^\/bids\/([^\/]+)$/', 'api/bids/delete.php', 'id'],
    ['POST', '/^\/bids\/([^\/]+)\/accept$/', 'api/bids/accept.php', 'id'],
    
    // Contracts
    ['GET', '/^\/contracts\/([^\/]+)$/', 'api/contracts/detail.php', 'id'],
    ['PUT', '/^\/contracts\/([^\/]+)$/', 'api/contracts/update.php', 'id'],
    ['PUT', '/^\/contracts\/([^\/]+)\/mark-complete$/', 'api/contracts/mark-complete.php', 'id'],
    ['PUT', '/^\/contracts\/([^\/]+)\/accept-completion$/', 'api/contracts/accept-completion.php', 'id'],
    ['PUT', '/^\/contracts\/([^\/]+)\/dispute$/', 'api/contracts/dispute.php', 'id'],
    ['PUT', '/^\/contracts\/([^\/]+)\/cancel$/', 'api/contracts/cancel.php', 'id'],
    
    // Milestones
    ['GET', '/^\/milestones\/contract\/([^\/]+)$/', 'api/milestones/index.php', 'contract_id'],
    ['POST', '/^\/milestones$/', 'api/milestones/create.php', null],
    ['PUT', '/^\/milestones\/([^\/]+)$/', 'api/milestones/update.php', 'id'],
    ['PUT', '/^\/milestones\/([^\/]+)\/submit$/', 'api/milestones/submit.php', 'id'],
    ['PUT', '/^\/milestones\/([^\/]+)\/approve$/', 'api/milestones/approve.php', 'id'],
    ['PUT', '/^\/milestones\/([^\/]+)\/reject$/', 'api/milestones/reject.php', 'id'],
    ['PUT', '/^\/milestones\/([^\/]+)\/release$/', 'api/milestones/release.php', 'id'],
    ['DELETE', '/^\/milestones\/([^\/]+)$/', 'api/milestones/delete.php', 'id'],
    
    // Messages
    ['GET', '/^\/messages\/contract\/([^\/]+)$/', 'api/messages/index.php', 'contract_id'],
    ['POST', '/^\/messages$/', 'api/messages/send.php', null],
    
    // Notifications
    ['PATCH', '/^\/notifications\/([^\/]+)\/read$/', 'api/notifications/read.php', 'id'],
    ['DELETE', '/^\/notifications\/([^\/]+)$/', 'api/notifications/read.php', 'id'],
    
    // Reviews
    ['GET', '/^\/reviews\/user\/([^\/]+)$/', 'api/reviews/index.php', 'user_id'],
    ['GET', '/^\/reviews\/project\/([^\/]+)$/', 'api/reviews/index.php', 'project_id'],
    
    // Users
    ['GET', '/^\/users\/([^\/]+)\/public$/', 'api/users/public.php', 'id'],
    
    // Admin
    ['GET', '/^\/admin\/users\/([^\/]+)$/', 'api/admin/users.php', 'id'],
    ['PATCH', '/^\/admin\/users\/([^\/]+)\/status$/', 'api/admin/users.php', 'id'],
    ['DELETE', '/^\/admin\/users\/([^\/]+)$/', 'api/admin/users.php', 'id'],
    ['PATCH', '/^\/admin\/projects\/([^\/]+)\/status$/', 'api/admin/projects.php', 'id'],
    ['DELETE', '/^\/admin\/projects\/([^\/]+)$/', 'api/admin/projects.php', 'id'],
    ['POST', '/^\/admin\/disputes\/([^\/]+)\/resolve$/', 'api/admin/disputes.php', 'id'],
    
    // Advertisements
    ['POST', '/^\/advertisements\/([^\/]+)\/click$/', 'api/advertisements/index.php', 'id'],
];

foreach ($dynamicRoutes as $route) {
    list($method, $pattern, $file, $paramName) = $route;
    
    if ($requestMethod === $method && preg_match($pattern, $path, $matches)) {
        if ($paramName && isset($matches[1])) {
            $_GET[$paramName] = $matches[1];
        }
        require_once __DIR__ . '/' . $file;
        exit;
    }
}

// ============================================
// 404 - Rota não encontrada
// ============================================
header("Content-Type: application/json");
http_response_code(404);
echo json_encode([
    'error' => 'Rota não encontrada',
    'path' => $path,
    'method' => $requestMethod
]);
