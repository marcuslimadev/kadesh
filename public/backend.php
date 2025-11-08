<?php
/**
 * Kadesh Backend - PHP Puro (sem Laravel)
 * Backend REST API completo para substituir Laravel + Sanctum
 * 
 * ACESSO: http://localhost/kadesh/ (XAMPP) ou https://kadesh.mmbsites.com.br (produção)
 * Same-origin: CORS não necessário
 */

// Configurar session cookie params ANTES de session_start()
$isProduction = !empty($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'mmbsites.com.br') !== false;

// Path do cookie: sempre / (funciona tanto em localhost quanto subdomínio)
$cookiePath = '/';

session_set_cookie_params([
    'lifetime' => 0,              // Sessão expira ao fechar navegador
    'path' => $cookiePath,        // Cookie path baseado no ambiente
    'domain' => '',               // Vazio = usa domínio atual automaticamente
    'secure' => $isProduction,    // true em HTTPS (produção), false em HTTP (local)
    'httponly' => true,           // Previne acesso via JavaScript
    'samesite' => 'Lax'           // Permite envio em navegação normal
]);

// Start session ANTES de qualquer output
session_start();

// Headers CORS para desenvolvimento (permitir requisições do Vite dev server)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (strpos($origin, 'localhost:') !== false || strpos($origin, '127.0.0.1:') !== false) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

// Responder OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Autoload and new architecture
require_once __DIR__ . '/../src/Backend/Core/Model.php';
require_once __DIR__ . '/../src/Backend/Models/User.php';
require_once __DIR__ . '/../src/Backend/Models/Project.php';
require_once __DIR__ . '/../src/Backend/Core/Logger.php';
require_once __DIR__ . '/../src/Backend/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Backend/Controllers/ProjectController.php';

use App\Backend\Controllers\AuthController;
use App\Backend\Controllers\ProjectController;
use App\Backend\Core\Logger;

// Headers de resposta
header('Content-Type: application/json; charset=utf-8');

// ==================== DATABASE ====================
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        // Configurações MySQL
        $host = 'localhost';
        $dbname = 'kadesh';
        $username = 'root';
        $password = '';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            $pdo = new PDO($dsn, $username, $password, $options);
            
            // Nota: As tabelas serão criadas via migrations SQL separadas
            // Não precisamos mais criar tabelas automaticamente aqui
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database connection failed', 'error' => $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}


// ==================== AUTH HELPERS ====================
function requireAuth() {
    // ✅ Aceitar tanto usuário comum quanto admin
    $isUser = isset($_SESSION['user_id']);
    $isAdmin = isset($_SESSION['is_admin']) && $_SESSION['is_admin'];
    
    if (!$isUser && !$isAdmin) {
        http_response_code(401);
        echo json_encode(['message' => 'Não autenticado']);
        exit;
    }
}

function getCurrentUser() {
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT id, name, email, user_type, created_at, updated_at FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch();
}

// ==================== ROUTER ====================
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];

// Extrair o path da URL
$path = parse_url($requestUri, PHP_URL_PATH);

// Remover o prefixo /kadesh se existir (para funcionar tanto em localhost/kadesh quanto em subdomínio)
$path = preg_replace('#^/kadesh#', '', $path);

// Remover /public se existir
$path = preg_replace('#^/public#', '', $path);

$method = $_SERVER['REQUEST_METHOD'];

// DEBUG: Mostrar informações de roteamento
error_log("=== BACKEND ROUTER DEBUG ===");
error_log("REQUEST_URI: " . $requestUri);
error_log("SCRIPT_NAME: " . $scriptName);
error_log("PARSED PATH: " . $path);
error_log("METHOD: " . $method);
error_log("===========================");

// Garantir que path começa com /
if (!empty($path) && $path[0] !== '/') {
    $path = '/' . $path;
}

// ==================== LER INPUT UMA VEZ ====================
// php://input só pode ser lido uma vez, então fazemos isso globalmente
$rawInput = file_get_contents('php://input');
$_POST_JSON = json_decode($rawInput, true);

// DEBUG: Mostrar path calculado se query string contém debug=1
if (isset($_GET['debug']) && $_GET['debug'] === '1') {
    header('Content-Type: application/json');
    echo json_encode([
        'REQUEST_URI' => $requestUri,
        'SCRIPT_NAME' => $scriptName,
        'CALCULATED_PATH' => $path,
        'METHOD' => $method,
        'GET' => $_GET,
        'POST_RAW' => $rawInput,
        'POST_PARSED' => $_POST_JSON
    ], JSON_PRETTY_PRINT);
    exit;
}

try {
    // HEALTHCHECK (PUBLIC)
    if ($path === '/api/health' && $method === 'GET') {
        handleHealth();
        exit;
    }

    // AUTH ROUTES (New Architecture)
    $authController = new AuthController();
    if ($path === '/api/register' && $method === 'POST') {
        $authController->register();
        exit;
    }
    if ($path === '/api/login' && $method === 'POST') {
        $authController->login();
        exit;
    }
    if ($path === '/api/logout' && $method === 'POST') {
        $authController->logout();
        exit;
    }
    if ($path === '/api/user' && $method === 'GET') {
        $authController->currentUser();
        exit;
    }

    // PROJECT ROUTES (New Architecture)
    $projectController = new ProjectController();
    
    // Public routes
    if ($path === '/api/projects' && $method === 'GET') {
        $projectController->index();
        exit;
    }
    if (preg_match('#^/api/projects/(\d+)$#', $path, $matches) && $method === 'GET') {
        $projectController->show($matches[1]);
        exit;
    }

    // AUCTIONS (Public) - Leilões ativos e detalhe do leilão
    if ($path === '/api/auctions/active' && $method === 'GET') {
        handleGetActiveAuctions();
        exit;
    }

    if (preg_match('#^/api/auctions/(\d+)$#', $path, $matches) && $method === 'GET') {
        handleGetAuction($matches[1]);
        exit;
    }
    
    // Protected routes - My projects
    if ($path === '/api/projects/my' && $method === 'GET') {
        requireAuth();
        $projectController->myProjects();
        exit;
    }
    
    // Protected routes - Create project
    if ($path === '/api/projects' && $method === 'POST') {
        requireAuth();
        $projectController->create();
        exit;
    }
    
    // Protected routes - Update project
    if (preg_match('#^/api/projects/(\d+)$#', $path, $matches) && $method === 'PUT') {
        requireAuth();
        $projectController->update($matches[1]);
        exit;
    }
    
    // Protected routes - Delete project
    if (preg_match('#^/api/projects/(\d+)$#', $path, $matches) && $method === 'DELETE') {
        requireAuth();
        $projectController->delete($matches[1]);
        exit;
    }
    
    // Protected routes - Close project
    if (preg_match('#^/api/projects/(\d+)/close$#', $path, $matches) && $method === 'POST') {
        requireAuth();
        $projectController->close($matches[1]);
        exit;
    }

    if ($path === '/api/forgot-password' && $method === 'POST') {
        handleForgotPassword();
        exit;
    }
    
    // PUBLIC PROVIDER ROUTES
    if (preg_match('#^/api/providers/(\d+)/profile$#', $path, $matches) && $method === 'GET') {
        handleGetProviderProfile($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/providers/(\d+)/reviews$#', $path, $matches) && $method === 'GET') {
        handleGetProviderReviews($matches[1]);
        exit;
    }
    
    // PUBLIC WEBHOOK ROUTE (Mercado Pago)
    if ($path === '/api/webhooks/mercadopago' && $method === 'POST') {
        handleMercadoPagoWebhook();
        exit;
    }
    
    // ADMIN LOGIN (PUBLIC)
    if ($path === '/api/admin/login' && $method === 'POST') {
        handleAdminLogin();
        exit;
    }
    
    // 🐛 DEBUG ENDPOINT (REMOVER EM PRODUÇÃO)
    if ($path === '/api/debug/session' && $method === 'GET') {
        echo json_encode([
            'session_id' => session_id(),
            'session_data' => $_SESSION,
            'cookies' => $_COOKIE,
            'is_admin' => $_SESSION['is_admin'] ?? false,
            'admin_id' => $_SESSION['admin_id'] ?? null,
            'user_id' => $_SESSION['user_id'] ?? null
        ], JSON_PRETTY_PRINT);
        exit;
    }
    
    // PROTECTED ROUTES
    requireAuth();
    
    if ($path === '/api/logout' && $method === 'POST') {
        handleLogout();
        exit;
    }
    
    if ($path === '/api/projects' && $method === 'POST') {
        handleCreateProject();
        exit;
    }
    
    if (preg_match('#^/api/projects/(\d+)$#', $path, $matches) && $method === 'GET') {
        handleShowProject($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/projects/(\d+)$#', $path, $matches) && $method === 'PUT') {
        handleUpdateProject($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/projects/(\d+)$#', $path, $matches) && $method === 'DELETE') {
        handleDeleteProject($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/projects/(\d+)/bids$#', $path, $matches) && $method === 'GET') {
        handleGetProjectBids($matches[1]);
        exit;
    }
    
    if ($path === '/api/bids' && $method === 'POST') {
        handleCreateBid();
        exit;
    }
    
    if (preg_match('#^/api/projects/(\d+)/accept-bid$#', $path, $matches) && $method === 'POST') {
        handleAcceptBid($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/projects/(\d+)/confirm-winner$#', $path, $matches) && $method === 'POST') {
        handleConfirmWinner($matches[1]);
        exit;
    }

    // MILESTONE ROUTES
    if (preg_match('#^/api/projects/(\d+)/milestones$#', $path, $matches) && $method === 'POST') {
        handleCreateMilestone($matches[1]);
        exit;
    }

    if (preg_match('#^/api/projects/(\d+)/milestones$#', $path, $matches) && $method === 'GET') {
        handleGetMilestones($matches[1]);
        exit;
    }

    if (preg_match('#^/api/milestones/(\d+)/fund$#', $path, $matches) && $method === 'POST') {
        handleFundMilestone($matches[1]);
        exit;
    }

    if (preg_match('#^/api/milestones/(\d+)/release$#', $path, $matches) && $method === 'POST') {
        handleReleaseMilestone($matches[1]);
        exit;
    }

    // DISPUTE ROUTES
    if (preg_match('#^/api/projects/(\d+)/disputes$#', $path, $matches) && $method === 'POST') {
        handleOpenDispute($matches[1]);
        exit;
    }

    if (preg_match('#^/api/disputes/(\d+)$#', $path, $matches) && $method === 'GET') {
        handleGetDispute($matches[1]);
        exit;
    }

    if (preg_match('#^/api/disputes/(\d+)/messages$#', $path, $matches) && $method === 'POST') {
        handlePostDisputeMessage($matches[1]);
        exit;
    }

    // TIMELINE ROUTE
    if (preg_match('#^/api/projects/(\d+)/timeline$#', $path, $matches) && $method === 'GET') {
        handleGetProjectTimeline($matches[1]);
        exit;
    }

    // KYC UPLOAD ROUTE
    if ($path === '/api/kyc-upload' && $method === 'POST') {
        handleKycUpload();
        exit;
    }

    // REVIEW ROUTES
    if ($path === '/api/reviews' && $method === 'POST') {
        handleCreateReview();
        exit;
    }

    if (preg_match('#^/api/users/(\d+)/reviews$#', $path, $matches) && $method === 'GET') {
        handleGetUserReviews($matches[1]);
        exit;
    }

    if (preg_match('#^/api/users/(\d+)$#', $path, $matches) && $method === 'GET') {
        handleGetUserPublicProfile($matches[1]);
        exit;
    }

    // NOTIFICATION ROUTES
    if ($path === '/api/notifications' && $method === 'GET') {
        handleGetNotifications();
        exit;
    }

    // WALLET ROUTES
    if ($path === '/api/wallet/balance' && $method === 'GET') {
        handleGetWalletBalance();
        exit;
    }

    if ($path === '/api/wallet/transactions' && $method === 'GET') {
        handleGetWalletTransactions();
        exit;
    }
    
    if ($path === '/api/dashboard/stats' && $method === 'GET') {
        handleDashboardStats();
        exit;
    }
    
    // PROVIDER PROFILE ROUTES
    if ($path === '/api/profile' && $method === 'PUT') {
        handleUpdateProviderProfile();
        exit;
    }
    
    if ($path === '/api/portfolio/upload' && $method === 'POST') {
        handlePortfolioUpload();
        exit;
    }
    
    if (preg_match('#^/api/portfolio/(\d+)$#', $path, $matches) && $method === 'DELETE') {
        handleDeletePortfolio($matches[1]);
        exit;
    }
    
    // PAYMENT ROUTES
    if (preg_match('#^/api/projects/(\d+)/payment$#', $path, $matches) && $method === 'POST') {
        handleCreatePayment($matches[1]);
        exit;
    }
    
    // REVIEW ROUTES
    if (preg_match('#^/api/projects/(\d+)/complete$#', $path, $matches) && $method === 'POST') {
        handleCompleteProject($matches[1]);
        exit;
    }
    
    if ($path === '/api/reviews' && $method === 'POST') {
        handleCreateReview();
        exit;
    }
    
    if (preg_match('#^/api/reviews/(\d+)/photos$#', $path, $matches) && $method === 'POST') {
        handleUploadReviewPhotos($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/reviews/(\d+)/response$#', $path, $matches) && $method === 'POST') {
        handleProviderResponse($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/reviews/(\d+)/helpful$#', $path, $matches) && $method === 'POST') {
        handleMarkReviewHelpful($matches[1]);
        exit;
    }
    
    // ADMIN ROUTES (PROTECTED)
    if ($path === '/api/admin/logout' && $method === 'POST') {
        handleAdminLogout();
        exit;
    }
    
    if ($path === '/api/admin/me' && $method === 'GET') {
        handleAdminMe();
        exit;
    }
    
    if ($path === '/api/admin/stats' && $method === 'GET') {
        handleAdminStats();
        exit;
    }
    
    if ($path === '/api/admin/users' && $method === 'GET') {
        handleAdminGetUsers();
        exit;
    }
    
    if ($path === '/api/admin/payments' && $method === 'GET') {
        handleAdminGetPayments();
        exit;
    }
    
    if ($path === '/api/admin/settings' && $method === 'GET') {
        handleAdminGetSettings();
        exit;
    }
    
    if ($path === '/api/admin/settings' && $method === 'PUT') {
        handleAdminUpdateSettings();
        exit;
    }
    
    // Gerenciamento de usuários
    if (preg_match('#^/api/admin/users/(\d+)$#', $path, $matches) && $method === 'GET') {
        handleAdminGetUser($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/admin/users/(\d+)/reset-password$#', $path, $matches) && $method === 'POST') {
        handleAdminResetPassword($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/admin/users/(\d+)/toggle-status$#', $path, $matches) && $method === 'POST') {
        handleAdminToggleUserStatus($matches[1]);
        exit;
    }
    
    if (preg_match('#^/api/admin/users/(\d+)$#', $path, $matches) && $method === 'DELETE') {
        handleAdminDeleteUser($matches[1]);
        exit;
    }
    
    // Gerenciamento de projetos
    if ($path === '/api/admin/projects' && $method === 'GET') {
        handleAdminGetProjects();
        exit;
    }
    
    if (preg_match('#^/api/admin/projects/(\d+)/close$#', $path, $matches) && $method === 'POST') {
        handleAdminCloseProject($matches[1]);
        exit;
    }
    
    // 404
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint não encontrado', 'path' => $path]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erro no banco de dados', 'error' => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Erro no servidor', 'error' => $e->getMessage()]);
}

// ==================== HANDLERS ====================

function handleHealth() {
    echo json_encode([
        'status' => 'ok',
        'time' => date('c'),
        'app' => 'kadesh-backend-php',
        'php' => PHP_VERSION,
    ]);
}

function handleRegister() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $user_type = $input['type'] ?? 'contractor'; // Usar 'type' do frontend, mapear para 'user_type'
    $profession = $input['profession'] ?? null;
    $hourly_rate = $input['hourly_rate'] ?? null;
    $bio = $input['bio'] ?? null;
    
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(422);
        echo json_encode(['message' => 'Validação falhou', 'errors' => ['email' => ['Campos obrigatórios faltando']]]);
        return;
    }
    
    $db = getDB();
    
    // Check if email exists
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(422);
        echo json_encode(['message' => 'Validação falhou', 'errors' => ['email' => ['Email já existe']]]);
        return;
    }
    
    // Create user (remover profession/hourly_rate que não existem na tabela)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO users (name, email, password, user_type, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime("now"), datetime("now"))');
    $stmt->execute([$name, $email, $hashedPassword, $user_type, $bio]);
    
    $userId = $db->lastInsertId();
    $_SESSION['user_id'] = $userId;
    
    echo json_encode([
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'type' => $user_type,
            'bio' => $bio
        ]
    ]);
}

function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    
    $db = getDB();
    
    // Unified login: Check the users table
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Check if the user is an admin
        if ($user['user_type'] === 'admin') {
            $_SESSION['is_admin'] = true;
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_name'] = $user['name'];
            $_SESSION['admin_email'] = $user['email'];
            $_SESSION['user_id'] = $user['id']; // Also set user_id for compatibility

            echo json_encode([
                'user_type' => 'admin',
                'admin' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                ]
            ]);
            return;
        }

        // It's a regular user
        $_SESSION['user_id'] = $user['id'];
        
        echo json_encode([
            'user_type' => 'user',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'type' => $user['user_type']
            ]
        ]);
        return;
    }
    
    // If we reach here, the login failed
    http_response_code(422);
    echo json_encode(['message' => 'As credenciais fornecidas estão incorretas.', 'errors' => ['email' => ['Credenciais inválidas']]]);
}




function handleForgotPassword() {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    
    if (empty($email)) {
        http_response_code(422);
        echo json_encode(['message' => 'Email é obrigatório', 'errors' => ['email' => ['Email obrigatório']]]);
        return;
    }
    
    $db = getDB();
    $stmt = $db->prepare('SELECT id, name FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // Por segurança, sempre retorna sucesso mesmo se email não existir
    // Isso previne enumeração de emails cadastrados
    
    if ($user) {
        // TODO: Implementar envio de email real
        // Por enquanto, apenas log (em produção isso seria enviado por email)
        error_log("Password reset requested for: {$email} (User ID: {$user['id']})");
        
        // Em produção você faria:
        // 1. Gerar token único
        // 2. Salvar token no banco com expiração (ex: 1 hora)
        // 3. Enviar email com link: https://kadesh.mmbsites.com.br/reset-password?token=XYZ
        // 4. Criar página de reset que valida token e permite nova senha
    }
    
    // Sempre retorna sucesso para não revelar se email existe
    echo json_encode([
        'message' => 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.'
    ]);
}

function handleLogout() {
    session_destroy();
    echo json_encode(['message' => 'Logout realizado com sucesso']);
}

function handleGetUser() {
    // ✅ Retornar dados de ADMIN se estiver logado como admin
    if (isset($_SESSION['is_admin']) && $_SESSION['is_admin']) {
        echo json_encode([
            'user' => [
                'id' => $_SESSION['admin_id'] ?? null,
                'name' => $_SESSION['admin_name'] ?? 'Admin',
                'email' => $_SESSION['admin_email'] ?? '',
                'user_type' => 'admin',
                'is_admin' => true
            ]
        ]);
        return;
    }
    
    // Retorna usuário comum ou null se não autenticado
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Não autenticado', 'user' => null]);
        return;
    }
    
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Sessão inválida', 'user' => null]);
        return;
    }
    
    echo json_encode(['user' => $user]);
}

function handleGetProjects() {
    $db = getDB();
    
    $keyword = $_GET['keyword'] ?? '';
    $maxBudget = $_GET['max_budget'] ?? null;

    $sql = '
        SELECT p.*, u.name as user_name, u.email as user_email,
               COALESCE((SELECT COUNT(*) FROM bids WHERE project_id = p.id), 0) as bids_count
        FROM projects p
        LEFT JOIN users u ON p.contractor_id = u.id
        WHERE 1=1
    ';
    $params = [];

    if (!empty($keyword)) {
        $sql .= ' AND p.title LIKE ?';
        $params[] = "%{$keyword}%";
    }

    if ($maxBudget !== null) {
        $sql .= ' AND p.max_budget <= ?';
        $params[] = (float)$maxBudget;
    }

    $sql .= ' ORDER BY p.created_at DESC';

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $projects = $stmt->fetchAll();
        echo json_encode($projects);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Erro no banco de dados', 
            'error' => $e->getMessage(),
            'code' => $e->getCode()
        ]);
    }
}

function logProjectEvent($projectId, $eventType, $description) {
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO project_events (project_id, event_type, description) VALUES (?, ?, ?)');
    $stmt->execute([$projectId, $eventType, $description]);
}

function handleCreateProject() {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = getCurrentUser();
    
    // Parse dates
    $biddingEndsAt = isset($input['bidding_ends_at']) ? date('Y-m-d H:i:s', strtotime($input['bidding_ends_at'])) : date('Y-m-d H:i:s', strtotime('+7 days'));
    $projectDeadline = isset($input['project_deadline']) ? date('Y-m-d H:i:s', strtotime($input['project_deadline'])) : null;
    
    // Parse JSON fields
    $requiredSkills = isset($input['required_skills']) ? json_encode($input['required_skills']) : '[]';
    $attachments = isset($input['attachments']) ? json_encode($input['attachments']) : null;
    
    $db = getDB();
    
    try {
        $stmt = $db->prepare('
            INSERT INTO projects (
                contractor_id, title, description, max_budget, 
                bidding_ends_at, project_deadline, required_skills, 
                attachments, status, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))
        ');
        
        $stmt->execute([
            $user['id'],
            $input['title'] ?? '',
            $input['description'] ?? '',
            $input['max_budget'] ?? 0,
            $biddingEndsAt,
            $projectDeadline,
            $requiredSkills,
            $attachments,
            'open'
        ]);
        
        $projectId = $db->lastInsertId();
        
        logProjectEvent($projectId, 'project_created', "Projeto criado por {$user['name']}.");

        // Return created project
        $stmt = $db->prepare('SELECT * FROM projects WHERE id = ?');
        $stmt->execute([$projectId]);
        
        echo json_encode($stmt->fetch());
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Database error',
            'error' => $e->getMessage()
        ]);
    }
}

function handleShowProject($id) {
    $db = getDB();
    $stmt = $db->prepare('
        SELECT p.*, u.name as user_name, u.email as user_email
        FROM projects p
        LEFT JOIN users u ON p.contractor_id = u.id
        WHERE p.id = ?
    ');
    $stmt->execute([$id]);
    $project = $stmt->fetch();
    
    if (!$project) {
        http_response_code(404);
        echo json_encode(['message' => 'Project not found']);
        return;
    }
    
    echo json_encode($project);
}

function handleUpdateProject($id) {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = getCurrentUser();
    
    $db = getDB();
    
    // Check ownership
    $stmt = $db->prepare('SELECT contractor_id FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    $project = $stmt->fetch();
    
    if (!$project || $project['contractor_id'] != $user['id']) {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        return;
    }
    
    // Parse dates
    $biddingEndsAt = isset($input['bidding_ends_at']) ? date('Y-m-d H:i:s', strtotime($input['bidding_ends_at'])) : null;
    $projectDeadline = isset($input['project_deadline']) ? date('Y-m-d H:i:s', strtotime($input['project_deadline'])) : null;
    
    // Parse JSON fields
    $requiredSkills = isset($input['required_skills']) ? json_encode($input['required_skills']) : null;
    
    $stmt = $db->prepare('
        UPDATE projects
        SET title = ?, description = ?, max_budget = ?, 
            bidding_ends_at = COALESCE(?, bidding_ends_at),
            project_deadline = COALESCE(?, project_deadline),
            required_skills = COALESCE(?, required_skills),
            updated_at = datetime("now")
        WHERE id = ?
    ');
    
    $stmt->execute([
        $input['title'] ?? '',
        $input['description'] ?? '',
        $input['max_budget'] ?? 0,
        $biddingEndsAt,
        $projectDeadline,
        $requiredSkills,
        $id
    ]);
    
    handleShowProject($id);
}

function handleDeleteProject($id) {
    $user = getCurrentUser();
    $db = getDB();
    
    // Check ownership
    $stmt = $db->prepare('SELECT contractor_id FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    $project = $stmt->fetch();
    
    if (!$project || $project['contractor_id'] != $user['id']) {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        return;
    }
    
    $stmt = $db->prepare('DELETE FROM projects WHERE id = ?');
    $stmt->execute([$id]);
    
    echo json_encode(['message' => 'Project deleted']);
}

function handleGetProjectBids($projectId) {
    requireAuth();
    
    $user = getCurrentUser();
    $db = getDB();
    
    // Verificar se projeto existe
    $stmt = $db->prepare('SELECT contractor_id FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    
    if (!$project) {
        http_response_code(404);
        echo json_encode(['message' => 'Projeto não encontrado']);
        return;
    }
    
    // Apenas o dono do projeto pode ver as propostas
    if ($project['contractor_id'] != $user['id']) {
        http_response_code(403);
        echo json_encode(['message' => 'Você não tem permissão para ver estas propostas']);
        return;
    }
    
    // Buscar propostas com dados dos prestadores
    $stmt = $db->prepare('
        SELECT 
            b.*,
            u.name as provider_name,
            u.email as provider_email,
            u.rating as provider_rating,
            u.total_ratings as provider_total_ratings,
            u.phone as provider_phone
        FROM bids b
        LEFT JOIN users u ON b.provider_id = u.id
        WHERE b.project_id = ?
        ORDER BY b.amount ASC, b.created_at ASC
    ');
    $stmt->execute([$projectId]);
    $bids = $stmt->fetchAll();
    
    // Formatar dados
    foreach ($bids as &$bid) {
        $bid['id'] = (int)$bid['id'];
        $bid['amount'] = (float)$bid['amount'];
        $bid['delivery_time_days'] = (int)($bid['delivery_time_days'] ?? 0);
        $bid['provider_rating'] = $bid['provider_rating'] ? (float)$bid['provider_rating'] : 0;
        
        if (!empty($bid['created_at'])) {
            $bid['created_at'] = date('c', strtotime($bid['created_at']));
        }
    }
    
    echo json_encode([
        'bids' => $bids,
        'total' => count($bids)
    ]);
}

function handleAcceptBid($projectId) {
    requireAuth();
    
    $user = getCurrentUser();
    $db = getDB();
    
    // Verificar se usuário é o dono do projeto
    $stmt = $db->prepare('SELECT contractor_id, status FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    
    if (!$project) {
        http_response_code(404);
        echo json_encode(['message' => 'Projeto não encontrado']);
        return;
    }
    
    if ($project['contractor_id'] != $user['id']) {
        http_response_code(403);
        echo json_encode(['message' => 'Você não tem permissão para aceitar propostas neste projeto']);
        return;
    }
    
    if ($project['status'] !== 'open') {
        http_response_code(400);
        echo json_encode(['message' => 'Este projeto não está mais aceitando propostas']);
        return;
    }
    
    // Obter bid_id do corpo da requisição
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['bid_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'ID da proposta é obrigatório']);
        return;
    }
    
    $bidId = $input['bid_id'];
    
    // Verificar se a proposta existe e pertence ao projeto
    $stmt = $db->prepare('SELECT id, provider_id, amount FROM bids WHERE id = ? AND project_id = ?');
    $stmt->execute([$bidId, $projectId]);
    $bid = $stmt->fetch();
    
    if (!$bid) {
        http_response_code(404);
        echo json_encode(['message' => 'Proposta não encontrada']);
        return;
    }
    
    try {
        $db->beginTransaction();
        
        // Atualizar projeto: status, winner_id, winner_bid_id, final_price
        $stmt = $db->prepare('
            UPDATE projects 
            SET status = ?, 
                winner_id = ?, 
                winner_bid_id = ?,
                final_price = ?,
                started_at = NOW(),
                updated_at = NOW()
            WHERE id = ?
        ');
        $stmt->execute(['in_progress', $bid['provider_id'], $bidId, $bid['amount'], $projectId]);
        
        // Atualizar proposta aceita
        $stmt = $db->prepare('UPDATE bids SET status = ?, updated_at = NOW() WHERE id = ?');
        $stmt->execute(['accepted', $bidId]);
        
        // Rejeitar todas as outras propostas
        $stmt = $db->prepare('
            UPDATE bids 
            SET status = ?, updated_at = NOW() 
            WHERE project_id = ? AND id != ?
        ');
        $stmt->execute(['rejected', $projectId, $bidId]);
        
        $db->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Proposta aceita com sucesso',
            'project_id' => (int)$projectId,
            'bid_id' => (int)$bidId,
            'provider_id' => (int)$bid['provider_id']
        ]);
        
    } catch (PDOException $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['message' => 'Erro ao aceitar proposta', 'error' => $e->getMessage()]);
    }
}

function handleCreateBid() {
    requireAuth();
    
    $user = getCurrentUser();
    
    // Validar que usuário é prestador
    if ($user['user_type'] !== 'provider') {
        http_response_code(403);
        echo json_encode(['message' => 'Apenas prestadores podem fazer propostas']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validações
    if (empty($input['project_id'])) {
        http_response_code(400);
        echo json_encode(['message' => 'ID do projeto é obrigatório']);
        return;
    }
    
    if (empty($input['amount']) || $input['amount'] <= 0) {
        http_response_code(400);
        echo json_encode(['message' => 'Valor da proposta deve ser maior que zero']);
        return;
    }
    
    if (empty($input['delivery_time_days']) || $input['delivery_time_days'] <= 0) {
        http_response_code(400);
        echo json_encode(['message' => 'Prazo de entrega é obrigatório']);
        return;
    }
    
    if (empty($input['proposal'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Descrição da proposta é obrigatória']);
        return;
    }
    
    $db = getDB();
    
    // Verificar se projeto existe e está aberto
    $stmt = $db->prepare('SELECT id, contractor_id, status, bidding_ends_at FROM projects WHERE id = ?');
    $stmt->execute([$input['project_id']]);
    $project = $stmt->fetch();
    
    if (!$project) {
        http_response_code(404);
        echo json_encode(['message' => 'Projeto não encontrado']);
        return;
    }
    
    if ($project['status'] !== 'open') {
        http_response_code(400);
        echo json_encode(['message' => 'Projeto não está aceitando propostas']);
        return;
    }
    
    // Verificar se prazo ainda está válido
    if ($project['bidding_ends_at'] && strtotime($project['bidding_ends_at']) < time()) {
        http_response_code(400);
        echo json_encode(['message' => 'Prazo para propostas encerrado']);
        return;
    }
    
    // Verificar se prestador já fez proposta neste projeto
    $stmt = $db->prepare('SELECT id FROM bids WHERE project_id = ? AND provider_id = ?');
    $stmt->execute([$input['project_id'], $user['id']]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['message' => 'Você já fez uma proposta para este projeto']);
        return;
    }
    
    try {
        $stmt = $db->prepare('
            INSERT INTO bids (
                project_id, provider_id, amount, proposal, 
                delivery_time_days, status, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ');
        
        $stmt->execute([
            $input['project_id'],
            $user['id'],
            $input['amount'],
            $input['proposal'],
            $input['delivery_time_days'],
            'pending'
        ]);
        
        $bidId = $db->lastInsertId();
        
        // Buscar proposta criada com dados completos
        $stmt = $db->prepare('
            SELECT b.*, u.name as provider_name 
            FROM bids b 
            LEFT JOIN users u ON b.provider_id = u.id 
            WHERE b.id = ?
        ');
        $stmt->execute([$bidId]);
        $bid = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => 'Proposta enviada com sucesso',
            'bid' => $bid
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erro ao criar proposta', 'error' => $e->getMessage()]);
    }
}

// ==================== AUCTIONS HANDLERS ====================

function handleGetActiveAuctions() {
    $db = getDB();

    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $category = $_GET['category'] ?? null;

    $sql = "
        SELECT 
            p.id,
            p.title,
            p.description,
            p.max_budget,
            p.status,
            p.bidding_ends_at,
            p.created_at,
            p.required_skills,
            p.is_featured,
            u.name as contractor_name,
            u.rating as contractor_rating,
            u.total_ratings,
            COALESCE((SELECT COUNT(*) FROM bids b WHERE b.project_id = p.id), 0) as bids_count,
            (SELECT MIN(amount) FROM bids b WHERE b.project_id = p.id) as lowest_bid
        FROM projects p
        LEFT JOIN users u ON p.contractor_id = u.id
        WHERE p.status = 'open' 
            AND p.bidding_ends_at > NOW()
        ORDER BY p.is_featured DESC, p.bidding_ends_at ASC
        LIMIT ?
    ";

    try {
        $stmt = $db->prepare($sql);
        $stmt->execute([$limit]);
        $auctions = $stmt->fetchAll();

        // Formatar dados para o frontend
        foreach ($auctions as &$auction) {
            // Converter data para ISO 8601
            if (!empty($auction['bidding_ends_at'])) {
                $auction['bidding_ends_at'] = date('c', strtotime($auction['bidding_ends_at']));
            }
            if (!empty($auction['created_at'])) {
                $auction['created_at'] = date('c', strtotime($auction['created_at']));
            }

            // Garantir tipos corretos
            $auction['id'] = (int)$auction['id'];
            $auction['max_budget'] = (float)($auction['max_budget'] ?? 0);
            $auction['lowest_bid'] = $auction['lowest_bid'] ? (float)$auction['lowest_bid'] : null;
            $auction['bids_count'] = (int)$auction['bids_count'];
            $auction['contractor_rating'] = $auction['contractor_rating'] ? (float)$auction['contractor_rating'] : 0;
            $auction['total_ratings'] = (int)($auction['total_ratings'] ?? 0);
            $auction['is_featured'] = (bool)$auction['is_featured'];
        }

        echo json_encode([
            'auctions' => $auctions, 
            'weights' => ['price' => 0.7, 'reputation' => 0.3],
            'total' => count($auctions)
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Erro ao buscar leilões', 'error' => $e->getMessage()]);
    }
}

function handleGetAuction($id) {
    $db = getDB();

    // Buscar projeto com dados do contratante
    $stmt = $db->prepare('
        SELECT 
            p.*,
            u.name as contractor_name, 
            u.rating as contractor_rating,
            u.total_ratings,
            u.email as contractor_email,
            u.phone as contractor_phone
        FROM projects p 
        LEFT JOIN users u ON p.contractor_id = u.id 
        WHERE p.id = ?
    ');
    $stmt->execute([$id]);
    $project = $stmt->fetch();

    if (!$project) {
        http_response_code(404);
        echo json_encode(['message' => 'Leilão não encontrado']);
        return;
    }

    // Buscar propostas com dados dos prestadores
    $stmt = $db->prepare('
        SELECT 
            b.*,
            u.name as provider_name,
            u.rating as provider_rating,
            u.total_ratings as provider_total_ratings,
            u.email as provider_email
        FROM bids b 
        LEFT JOIN users u ON b.provider_id = u.id 
        WHERE b.project_id = ? 
        ORDER BY b.amount ASC, b.created_at ASC
    ');
    $stmt->execute([$id]);
    $bids = $stmt->fetchAll();

    // Formatar datas para ISO 8601
    if (!empty($project['bidding_ends_at'])) {
        $project['bidding_ends_at'] = date('c', strtotime($project['bidding_ends_at']));
    }
    if (!empty($project['created_at'])) {
        $project['created_at'] = date('c', strtotime($project['created_at']));
    }

    // Formatar dados das propostas
    foreach ($bids as &$bid) {
        $bid['id'] = (int)$bid['id'];
        $bid['amount'] = (float)$bid['amount'];
        $bid['delivery_time_days'] = (int)($bid['delivery_time_days'] ?? 0);
        $bid['provider_rating'] = $bid['provider_rating'] ? (float)$bid['provider_rating'] : 0;
        
        if (!empty($bid['created_at'])) {
            $bid['created_at'] = date('c', strtotime($bid['created_at']));
        }
    }

    // Garantir tipos corretos no projeto
    $project['id'] = (int)$project['id'];
    $project['max_budget'] = (float)($project['max_budget'] ?? 0);
    $project['contractor_rating'] = $project['contractor_rating'] ? (float)$project['contractor_rating'] : 0;
    $project['bids'] = $bids;
    $project['bids_count'] = count($bids);
    $project['lowest_bid'] = !empty($bids) ? (float)$bids[0]['amount'] : null;

    echo json_encode(['project' => $project]);
}

function handleConfirmWinner($projectId) {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = getCurrentUser();
    $bidId = $input['bid_id'] ?? 0;
    
    $db = getDB();
    
    // Check project ownership
    $stmt = $db->prepare('SELECT contractor_id FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();
    
    if (!$project || $project['user_id'] != $user['id']) {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        return;
    }
    
    // Update project
    $stmt = $db->prepare('UPDATE projects SET winner_bid_id = ?, status = ?, updated_at = datetime("now") WHERE id = ?');
    $stmt->execute([$bidId, 'in_progress', $projectId]);
    
    // Update bid
    $stmt = $db->prepare('UPDATE bids SET status = ? WHERE id = ?');
    $stmt->execute(['accepted', $bidId]);
    
    echo json_encode(['message' => 'Winner confirmed']);
}

function handleDashboardStats() {
    $user = getCurrentUser();
    $db = getDB();
    
    if ($user['user_type'] === 'contractor') {
        $stmt = $db->prepare('SELECT COUNT(*) as total FROM projects WHERE contractor_id = ?');
        $stmt->execute([$user['id']]);
        $total = $stmt->fetch()['total'];
        
        $stmt = $db->prepare('SELECT COUNT(*) as open FROM projects WHERE contractor_id = ? AND status IN ("open", "bidding")');
        $stmt->execute([$user['id']]);
        $open = $stmt->fetch()['open'];
        
        $stmt = $db->prepare('SELECT COUNT(*) as in_progress FROM projects WHERE contractor_id = ? AND status = "in_progress"');
        $stmt->execute([$user['id']]);
        $inProgress = $stmt->fetch()['in_progress'];
        
        echo json_encode([
            'projects_total' => $total,
            'projects_open' => $open,
            'projects_in_progress' => $inProgress,
            'total_spent' => 0
        ]);
    } else {
        $stmt = $db->prepare('SELECT COUNT(*) as total FROM bids WHERE user_id = ?');
        $stmt->execute([$user['id']]);
        $total = $stmt->fetch()['total'];
        
        $stmt = $db->prepare('SELECT COUNT(*) as active FROM bids WHERE user_id = ? AND status = "pending"');
        $stmt->execute([$user['id']]);
        $active = $stmt->fetch()['active'];
        
        $stmt = $db->prepare('SELECT COUNT(*) as won FROM bids WHERE user_id = ? AND status = "accepted"');
        $stmt->execute([$user['id']]);
        $won = $stmt->fetch()['won'];
        
        echo json_encode([
            'bids_total' => $total,
            'bids_active' => $active,
            'projects_won' => $won,
            'earnings' => 0
        ]);
    }
}

// ==================== MILESTONE & ESCROW HANDLERS ====================

function handleCreateMilestone($projectId) {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = getCurrentUser();
    $db = getDB();

    $stmt = $db->prepare('SELECT contractor_id FROM projects WHERE id = ?');
    $stmt->execute([$projectId]);
    $project = $stmt->fetch();

    if (!$project || $project['contractor_id'] != $user['id']) {
        http_response_code(403);
        echo json_encode(['error' => 'Acesso negado.']);
        return;
    }

    $stmt = $db->prepare('INSERT INTO milestones (project_id, description, amount) VALUES (?, ?, ?)');
    $stmt->execute([$projectId, $input['description'], $input['amount']]);

    echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Milestone created']);
}

function handleGetMilestones($projectId) {
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM milestones WHERE project_id = ? ORDER BY created_at ASC');
    $stmt->execute([$projectId]);

    echo json_encode($stmt->fetchAll());
}

function handleFundMilestone($milestoneId) {
    $user = getCurrentUser();
    $db = getDB();

    $stmt = $db->prepare('SELECT * FROM milestones WHERE id = ?');
    $stmt->execute([$milestoneId]);
    $milestone = $stmt->fetch();

    $accessToken = getMercadoPagoAccessToken();

    $preferenceData = [
        'items' => [
            [
                'title' => "Financiamento do marco: {$milestone['description']}",
                'quantity' => 1,
                'unit_price' => (float)$milestone['amount'],
                'currency_id' => 'BRL',
            ]
        ],
        'back_urls' => [
            'success' => 'http://localhost:5173/payment/success',
            'failure' => 'http://localhost:5173/payment/failure',
        ],
        'auto_return' => 'approved',
        'external_reference' => $milestoneId,
    ];

    $ch = curl_init('https://api.mercadopago.com/checkout/preferences');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $accessToken,
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($preferenceData));
    $response = curl_exec($ch);
    curl_close($ch);

    $preference = json_decode($response, true);

    if (isset($preference['init_point'])) {
        echo json_encode(['checkout_url' => $preference['init_point']]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao criar preferência de pagamento.']);
    }
}

function handleReleaseMilestone($milestoneId) {
    $user = getCurrentUser(); // This should be the contractor
    $db = getDB();

    $stmt = $db->prepare('SELECT * FROM milestones WHERE id = ?');
    $stmt->execute([$milestoneId]);
    $milestone = $stmt->fetch();

    $stmt = $db->prepare('SELECT contractor_id FROM projects WHERE id = ?');
    $stmt->execute([$milestone['project_id']]);
    $project = $stmt->fetch();

    if (!$project || $project['contractor_id'] != $user['id']) {
        http_response_code(403);
        echo json_encode(['error' => 'Acesso negado.']);
        return;
    }

    $stmt = $db->prepare('SELECT u.id as provider_id FROM users u JOIN bids b ON u.id = b.user_id JOIN projects p ON b.id = p.winner_bid_id WHERE p.id = ?');
    $stmt->execute([$milestone['project_id']]);
    $provider = $stmt->fetch();

    // Use a transaction to ensure atomicity
    $db->beginTransaction();
    try {
        // 1. Credit provider's wallet
        $stmt = $db->prepare('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?');
        $stmt->execute([$milestone['amount'], $provider['provider_id']]);

        // 2. Create transaction record for the provider (credit)
        $stmt = $db->prepare("INSERT INTO transactions (user_id, project_id, type, amount, status) VALUES (?, ?, 'milestone_release', ?, 'completed')");
        $stmt->execute([$provider['provider_id'], $milestone['project_id'], $milestone['amount']]);

        // 3. (Optional) Create a transaction record for the contractor (debit from escrow, not wallet)
        // This is more for accounting and not directly affecting wallet_balance
        $stmt = $db->prepare("INSERT INTO transactions (user_id, project_id, type, amount, status) VALUES (?, ?, 'escrow_debit', ?, 'completed')");
        $stmt->execute([$user['id'], $milestone['project_id'], -$milestone['amount']]);

        // 4. Update milestone status
        $stmt = $db->prepare("UPDATE milestones SET status = 'released', release_date = datetime('now') WHERE id = ?");
        $stmt->execute([$milestoneId]);

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Falha na transação.']);
        return;
    }

    logProjectEvent($milestone['project_id'], 'milestone_released', "Marco '{$milestone['description']}' liberado.");

    echo json_encode(['message' => 'Milestone released']);
}

// ==================== TIMELINE HANDLER ====================

function handleGetProjectTimeline($projectId) {
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM project_events WHERE project_id = ? ORDER BY created_at ASC');
    $stmt->execute([$projectId]);

    echo json_encode($stmt->fetchAll());
}

// ==================== WALLET HANDLERS ====================

function handleGetWalletBalance() {
    $user = getCurrentUser();
    $db = getDB();

    $stmt = $db->prepare('SELECT wallet_balance FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    $balance = $stmt->fetchColumn();

    echo json_encode(['balance' => (float)$balance]);
}

function handleGetWalletTransactions() {
    $user = getCurrentUser();
    $db = getDB();

    $stmt = $db->prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$user['id']]);

    echo json_encode($stmt->fetchAll());
}


// ==================== DISPUTE HANDLERS ====================

function handleOpenDispute($projectId) {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = getCurrentUser();
    $db = getDB();

    // 1. Create the dispute
    $stmt = $db->prepare('INSERT INTO disputes (project_id, opened_by_user_id, reason) VALUES (?, ?, ?)');
    $stmt->execute([$projectId, $user['id'], $input['reason']]);
    $disputeId = $db->lastInsertId();

    // 2. Freeze milestones
    $stmt = $db->prepare("UPDATE milestones SET status = 'disputed' WHERE project_id = ? AND status = 'funded'");
    $stmt->execute([$projectId]);

    echo json_encode(['id' => $disputeId, 'message' => 'Dispute opened']);
}

function handleGetDispute($disputeId) {
    $db = getDB();

    $stmt = $db->prepare('SELECT * FROM disputes WHERE id = ?');
    $stmt->execute([$disputeId]);
    $dispute = $stmt->fetch();

    $stmt = $db->prepare('SELECT dm.*, u.name as user_name FROM dispute_messages dm JOIN users u ON dm.user_id = u.id WHERE dispute_id = ? ORDER BY created_at ASC');
    $stmt->execute([$disputeId]);
    $messages = $stmt->fetchAll();

    echo json_encode(['dispute' => $dispute, 'messages' => $messages]);
}

function handlePostDisputeMessage($disputeId) {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = getCurrentUser();
    $db = getDB();

    $stmt = $db->prepare('INSERT INTO dispute_messages (dispute_id, user_id, message) VALUES (?, ?, ?)');
    $stmt->execute([$disputeId, $user['id'], $input['message']]);

    echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Message posted']);
}


// ==================== KYC UPLOAD HANDLER ====================

function handleKycUpload() {
    $user = getCurrentUser();
    if (!isset($_FILES['document'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Nenhum arquivo enviado.']);
        return;
    }

    $file = $_FILES['document'];

    // Security Validations
    $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Tipo de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.']);
        return;
    }

    $maxSize = 5 * 1024 * 1024; // 5 MB
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'O arquivo excede o tamanho máximo de 5MB.']);
        return;
    }

    $uploadDir = __DIR__ . '/uploads/';
    $fileName = uniqid() . '-' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode(['message' => 'Upload bem-sucedido', 'path' => '/uploads/' . $fileName]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao salvar o arquivo.']);
    }
}


// ==================== REVIEW HANDLERS ====================

function handleCreateReview() {
    $input = json_decode(file_get_contents('php://input'), true);
    $reviewer = getCurrentUser();
    $db = getDB();

    // 1. Insert the review
    $stmt = $db->prepare('INSERT INTO reviews (project_id, reviewer_user_id, reviewed_user_id, rating, comment) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$input['project_id'], $reviewer['id'], $input['reviewed_user_id'], $input['rating'], $input['comment']]);
    $reviewId = $db->lastInsertId();

    // 2. Recalculate and update the reviewed user's rating
    $stmt = $db->prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings FROM reviews WHERE reviewed_user_id = ?');
    $stmt->execute([$input['reviewed_user_id']]);
    $stats = $stmt->fetch();

    $stmt = $db->prepare('UPDATE users SET rating = ?, total_ratings = ? WHERE id = ?');
    $stmt->execute([$stats['avg_rating'], $stats['total_ratings'], $input['reviewed_user_id']]);

    echo json_encode(['id' => $reviewId, 'message' => 'Review created']);
}

function handleGetUserReviews($userId) {
    $db = getDB();
    $stmt = $db->prepare('SELECT r.*, u.name as reviewer_name FROM reviews r JOIN users u ON r.reviewer_user_id = u.id WHERE r.reviewed_user_id = ? ORDER BY r.created_at DESC');
    $stmt->execute([$userId]);

    echo json_encode($stmt->fetchAll());
}


// ==================== USER PROFILE HANDLER ====================

function handleGetUserPublicProfile($userId) {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, name, user_type, bio, skills, rating, total_ratings, created_at FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }

    echo json_encode($user);
}


// ==================== NOTIFICATION HANDLERS ====================

function createNotification($userId, $message, $link = null) {
    $db = getDB();
    $stmt = $db->prepare('INSERT INTO notifications (user_id, message, link) VALUES (?, ?, ?)');
    $stmt->execute([$userId, $message, $link]);
}

function handleGetNotifications() {
    $user = getCurrentUser();
    $db = getDB();

    $stmt = $db->prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$user['id']]);

    echo json_encode($stmt->fetchAll());
}


// ==================== MERCADO PAGO HELPERS ====================

function getMercadoPagoAccessToken() {
    $db = getDB();
    // This assumes you have a setting with the key 'mp_access_token_test' or 'mp_access_token_prod'
    $stmt = $db->query("SELECT setting_value FROM system_settings WHERE setting_key = 'mp_access_token_test'");
    return $stmt->fetchColumn();
}


// ==================== STUB FUNCTIONS (Provider System) ====================
// TODO: Implementar sistema completo de fornecedores

function handleGetProviderProfile($providerId) {
    http_response_code(501);
    echo json_encode(['error' => 'Provider profile not implemented yet']);
}

function handleGetProviderReviews($providerId) {
    http_response_code(501);
    echo json_encode(['error' => 'Provider reviews not implemented yet']);
}

function handleUpdateProviderProfile() {
    http_response_code(501);
    echo json_encode(['error' => 'Update provider profile not implemented yet']);
}

function handlePortfolioUpload() {
    http_response_code(501);
    echo json_encode(['error' => 'Portfolio upload not implemented yet']);
}

function handleDeletePortfolio($id) {
    http_response_code(501);
    echo json_encode(['error' => 'Delete portfolio not implemented yet']);
}

// ==================== PAYMENT SYSTEM HANDLERS ====================

function handleCreatePayment($projectId) {
    // This can be used for direct payments if needed, for now milestones are used.
    http_response_code(501);
    echo json_encode(['error' => 'Direct payment not implemented yet']);
}

function handleCompleteProject($projectId) {
    // This would be called by the contractor to mark a project as finished.
    // Logic to notify the client and finalize the project would go here.
    http_response_code(501);
    echo json_encode(['error' => 'Complete project not implemented yet']);
}

function handleMercadoPagoWebhook() {
    $xSignature = $_SERVER['HTTP_X_SIGNATURE'] ?? '';
    $body = file_get_contents('php://input');

    // Validate signature
    $db = getDB();
    $stmt = $db->query("SELECT setting_value FROM system_settings WHERE setting_key = 'mp_webhook_secret_key_test'");
    $secret = $stmt->fetchColumn();

    if (!$secret || !validateMercadoPagoSignature($xSignature, $body, $secret)) {
        http_response_code(403);
        Logger::error("Webhook Error: Invalid signature.", ['signature' => $xSignature]);
        echo json_encode(['error' => 'Invalid signature']);
        return;
    }

    $notification = json_decode($body, true);

    if (isset($notification['type']) && $notification['type'] === 'payment') {
        // ... (rest of the logic remains the same)
    }

    http_response_code(200);
    echo json_encode(['status' => 'ok']);
}

function validateMercadoPagoSignature($signature, $payload, $secret) {
    $parts = explode(',', $signature);
    $ts = '';
    $hash = '';

    foreach ($parts as $part) {
        list($key, $value) = explode('=', $part, 2);
        if ($key === 'ts') {
            $ts = $value;
        } elseif ($key === 'v1') {
            $hash = $value;
        }
    }

    if (empty($ts) || empty($hash)) {
        return false;
    }

    $manifest = "ts:{$ts};payload:{$payload};";
    $expectedSignature = hash_hmac('sha256', $manifest, $secret);

    return hash_equals($expectedSignature, $hash);
}

// ==================== STUB FUNCTIONS (Review System) ====================
// TODO: Implementar sistema de avaliações
// handleCreateReview já implementada anteriormente no arquivo

function handleUploadReviewPhotos($reviewId) {
    http_response_code(501);
    echo json_encode(['error' => 'Upload review photos not implemented yet']);
}

function handleProviderResponse($reviewId) {
    http_response_code(501);
    echo json_encode(['error' => 'Provider response not implemented yet']);
}

function handleMarkReviewHelpful($reviewId) {
    http_response_code(501);
    echo json_encode(['error' => 'Mark review helpful not implemented yet']);
}

// ==================== ADMIN SYSTEM - Implementação Completa ====================

function handleAdminLogin() {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    $pdo = getDB();
    
    // Buscar admin no banco
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = 'admin' LIMIT 1");
    $stmt->execute([$email]);
    $admin = $stmt->fetch();
    
    if (!$admin || !password_verify($password, $admin['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciais inválidas']);
        return;
    }
    
    // Criar sessão admin
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_email'] = $admin['email'];
    $_SESSION['admin_name'] = $admin['name'];
    $_SESSION['is_admin'] = true;
    
    echo json_encode([
        'success' => true,
        'admin' => [
            'id' => $admin['id'],
            'name' => $admin['name'],
            'email' => $admin['email']
        ]
    ]);
}

function handleAdminLogout() {
    unset($_SESSION['admin_id']);
    unset($_SESSION['admin_email']);
    unset($_SESSION['admin_name']);
    unset($_SESSION['is_admin']);
    session_destroy();
    
    echo json_encode(['success' => true, 'message' => 'Logout realizado']);
}

function handleAdminMe() {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    echo json_encode([
        'id' => $_SESSION['admin_id'] ?? null,
        'name' => $_SESSION['admin_name'] ?? 'Admin',
        'email' => $_SESSION['admin_email'] ?? ''
    ]);
}

function handleAdminStats() {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    // Estatísticas de Usuários
    $usersTotal = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $usersProviders = $pdo->query("SELECT COUNT(*) FROM users WHERE user_type IN ('provider', 'both')")->fetchColumn();
    $usersContractors = $pdo->query("SELECT COUNT(*) FROM users WHERE user_type IN ('contractor', 'both')")->fetchColumn();
    $usersNewMonth = $pdo->query("SELECT COUNT(*) FROM users WHERE STRFTIME('%Y-%m', created_at) = STRFTIME('%Y-%m', 'now')")->fetchColumn();
    
    // Estatísticas de Projetos
    $projectsTotal = $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
    $projectsOpen = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'open'")->fetchColumn();
    $projectsInProgress = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'in_progress'")->fetchColumn();
    $projectsCompleted = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'completed'")->fetchColumn();
    
    // Estatísticas de Pagamentos
    $paymentsTotal = $pdo->query("SELECT COUNT(*) FROM transactions")->fetchColumn();
    $paymentsTotalAmount = $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'completed'")->fetchColumn();
    $platformFee = $paymentsTotalAmount * 0.10; // 10% de taxa
    $revenueThisMonth = $pdo->query("SELECT COALESCE(SUM(amount * 0.10), 0) FROM transactions WHERE status = 'completed' AND STRFTIME('%Y-%m', created_at) = STRFTIME('%Y-%m', 'now')")->fetchColumn();
    
    // Estatísticas de Avaliações
    $reviewsTotal = $pdo->query("SELECT COUNT(*) FROM reviews")->fetchColumn();
    $reviewsAverage = $pdo->query("SELECT COALESCE(AVG(rating), 0) FROM reviews")->fetchColumn();
    
    // Atividade dos últimos 7 dias (projetos criados por dia)
    $activity = $pdo->query("
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM projects 
        WHERE created_at >= DATE('now', '-7 days')
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    ")->fetchAll();
    
    echo json_encode([
        'users' => [
            'total' => (int)$usersTotal,
            'providers' => (int)$usersProviders,
            'contractors' => (int)$usersContractors,
            'new_this_month' => (int)$usersNewMonth
        ],
        'projects' => [
            'total' => (int)$projectsTotal,
            'open' => (int)$projectsOpen,
            'in_progress' => (int)$projectsInProgress,
            'completed' => (int)$projectsCompleted
        ],
        'payments' => [
            'total' => (int)$paymentsTotal,
            'total_amount' => (float)$paymentsTotalAmount,
            'platform_fee' => (float)$platformFee,
            'revenue_this_month' => (float)$revenueThisMonth
        ],
        'reviews' => [
            'total' => (int)$reviewsTotal,
            'average_rating' => (float)$reviewsAverage
        ],
        'activity' => $activity
    ]);
}

function handleAdminGetUsers() {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    // Filtros opcionais
    $type = $_GET['type'] ?? '';
    $search = $_GET['search'] ?? '';
    $status = $_GET['status'] ?? '';
    
    $sql = "SELECT 
        u.id, u.name, u.email, u.user_type, u.phone, 
        u.created_at, u.email_verified_at,
        COUNT(DISTINCT p.id) as projects_count,
        COUNT(DISTINCT b.id) as bids_count,
        AVG(r.rating) as average_rating
    FROM users u
    LEFT JOIN projects p ON u.id = p.contractor_id
    LEFT JOIN bids b ON u.id = b.provider_id
    LEFT JOIN reviews r ON u.id = r.provider_id
    WHERE 1=1";
    
    $params = [];
    
    if ($type) {
        $sql .= " AND u.user_type = ?";
        $params[] = $type;
    }
    
    if ($search) {
        $sql .= " AND (u.name LIKE ? OR u.email LIKE ?)";
        $searchParam = "%$search%";
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    $sql .= " GROUP BY u.id ORDER BY u.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll();
    
    echo json_encode($users);
}

function handleAdminGetPayments() {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    // Filtros opcionais
    $startDate = $_GET['start_date'] ?? '';
    $endDate = $_GET['end_date'] ?? '';
    $status = $_GET['status'] ?? '';
    
    $sql = "SELECT 
        t.*,
        p.title as project_title,
        u.name as user_name,
        u.email as user_email
    FROM transactions t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN users u ON t.user_id = u.id
    WHERE 1=1";
    
    $params = [];
    
    if ($startDate) {
        $sql .= " AND DATE(t.created_at) >= ?";
        $params[] = $startDate;
    }
    
    if ($endDate) {
        $sql .= " AND DATE(t.created_at) <= ?";
        $params[] = $endDate;
    }
    
    if ($status) {
        $sql .= " AND t.status = ?";
        $params[] = $status;
    }
    
    $sql .= " ORDER BY t.created_at DESC LIMIT 100";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $payments = $stmt->fetchAll();
    
    echo json_encode($payments);
}

function handleAdminGetSettings() {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->query("SELECT setting_key, setting_value, setting_category FROM system_settings");
    $settings = $stmt->fetchAll();
    
    // Converter array de settings em objeto agrupado por categoria
    $settingsObj = [];
    foreach ($settings as $setting) {
        $category = $setting['setting_category'];
        $key = $setting['setting_key'];
        
        if (!isset($settingsObj[$category])) {
            $settingsObj[$category] = [];
        }
        
        $settingsObj[$category][$key] = [
            'value' => $setting['setting_value']
        ];
    }
    
    echo json_encode($settingsObj);
}

function handleAdminUpdateSettings() {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $pdo = getDB();
    
    // Atualizar configurações (data vem agrupado por categoria)
    foreach ($data as $category => $settings) {
        foreach ($settings as $key => $config) {
            $value = $config['value'] ?? $config;
            
            $stmt = $pdo->prepare("
                UPDATE system_settings 
                SET setting_value = ?, updated_at = datetime('now')
                WHERE setting_key = ?
            ");
            $stmt->execute([$value, $key]);
        }
    }
    
    echo json_encode(['success' => true, 'message' => 'Configurações atualizadas']);
}

// ==================== FUNÇÕES ADMIN ADICIONAIS ====================

function handleAdminGetUser($userId) {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("
        SELECT 
            u.*,
            COUNT(DISTINCT p.id) as projects_count,
            COUNT(DISTINCT b.id) as bids_count,
            AVG(r.rating) as average_rating,
            COUNT(DISTINCT r.id) as reviews_count
        FROM users u
        LEFT JOIN projects p ON u.id = p.contractor_id
        LEFT JOIN bids b ON u.id = b.provider_id
        LEFT JOIN reviews r ON u.id = r.provider_id
        WHERE u.id = ?
        GROUP BY u.id
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado']);
        return;
    }
    
    echo json_encode($user);
}

function handleAdminResetPassword($userId) {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    // Gerar senha temporária
    $tempPassword = bin2hex(random_bytes(8)); // 16 caracteres
    $hashedPassword = password_hash($tempPassword, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->execute([$hashedPassword, $userId]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado']);
        return;
    }
    
    // TODO: Enviar email com senha temporária
    
    echo json_encode([
        'success' => true, 
        'temp_password' => $tempPassword,
        'message' => 'Senha resetada com sucesso'
    ]);
}

function handleAdminToggleUserStatus($userId) {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar se existe coluna 'status' ou 'active'
    // Por enquanto vamos usar email_verified_at como proxy para ativo/inativo
    $stmt = $pdo->prepare("SELECT email_verified_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado']);
        return;
    }
    
    $newStatus = $user['email_verified_at'] ? NULL : date('Y-m-d H:i:s');
    
    $stmt = $pdo->prepare("UPDATE users SET email_verified_at = ? WHERE id = ?");
    $stmt->execute([$newStatus, $userId]);
    
    echo json_encode([
        'success' => true,
        'active' => (bool)$newStatus,
        'message' => $newStatus ? 'Usuário ativado' : 'Usuário desativado'
    ]);
}

function handleAdminDeleteUser($userId) {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    // Verificar se usuário tem projetos/bids ativos
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as active_count
        FROM projects 
        WHERE contractor_id = ? AND status NOT IN ('completed', 'cancelled')
    ");
    $stmt->execute([$userId]);
    $result = $stmt->fetch();
    
    if ($result['active_count'] > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Usuário possui projetos ativos. Não pode ser deletado.']);
        return;
    }
    
    // Soft delete (marcar como deletado sem remover do banco)
    $stmt = $pdo->prepare("UPDATE users SET email = 'deleted_' || id || '_' || email, email_verified_at = NULL WHERE id = ?");
    $stmt->execute([$userId]);
    
    echo json_encode(['success' => true, 'message' => 'Usuário removido']);
}

function handleAdminGetProjects() {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $sql = "SELECT 
        p.*,
        u.name as contractor_name,
        u.email as contractor_email,
        COUNT(b.id) as bids_count,
        MIN(b.amount) as lowest_bid
    FROM projects p
    LEFT JOIN users u ON p.contractor_id = u.id
    LEFT JOIN bids b ON p.id = b.project_id
    WHERE 1=1";
    
    $params = [];
    
    if ($status) {
        $sql .= " AND p.status = ?";
        $params[] = $status;
    }
    
    if ($search) {
        $sql .= " AND (p.title LIKE ? OR p.description LIKE ?)";
        $searchParam = "%$search%";
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    $sql .= " GROUP BY p.id ORDER BY p.created_at DESC LIMIT 100";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();
    
    echo json_encode($projects);
}

function handleAdminCloseProject($projectId) {
    if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
        http_response_code(401);
        echo json_encode(['error' => 'Não autorizado']);
        return;
    }
    
    $pdo = getDB();
    
    $stmt = $pdo->prepare("UPDATE projects SET status = 'cancelled', completed_at = datetime('now') WHERE id = ?");
    $stmt->execute([$projectId]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Projeto não encontrado']);
        return;
    }
    
    echo json_encode(['success' => true, 'message' => 'Projeto encerrado pelo admin']);
}
