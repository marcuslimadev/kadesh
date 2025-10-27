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

// Headers de resposta
header('Content-Type: application/json; charset=utf-8');

// ==================== DATABASE ====================
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        // Detectar ambiente (local ou produção)
        $isLocal = ($_SERVER['HTTP_HOST'] ?? '') === 'localhost' || 
                   strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1') === 0;
        
        if ($isLocal) {
            // Configuração local XAMPP
            $pdo = new PDO(
                'mysql:host=127.0.0.1;dbname=kadesh;charset=utf8mb4',
                'root',
                '',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } else {
            // Configuração produção cPanel
            $pdo = new PDO(
                'mysql:host=127.0.0.1;dbname=mmbsites_kadesh;charset=utf8mb4',
                'mmbsites_kadesh',
                'kadesh@2025',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
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
$basePath = str_replace('backend.php', '', $scriptName);
$path = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
$method = $_SERVER['REQUEST_METHOD'];

// DEBUG: Mostrar informações de roteamento
error_log("=== BACKEND ROUTER DEBUG ===");
error_log("REQUEST_URI: " . $requestUri);
error_log("SCRIPT_NAME: " . $scriptName);
error_log("BASE_PATH: " . $basePath);
error_log("PARSED PATH: " . $path);
error_log("METHOD: " . $method);
error_log("===========================");

// Garantir que path começa com /
if (!empty($path) && $path[0] !== '/') {
    $path = '/' . $path;
}

// DEBUG: Mostrar path calculado se query string contém debug=1
if (isset($_GET['debug']) && $_GET['debug'] === '1') {
    header('Content-Type: application/json');
    echo json_encode([
        'REQUEST_URI' => $requestUri,
        'SCRIPT_NAME' => $scriptName,
        'BASE_PATH' => $basePath,
        'CALCULATED_PATH' => $path,
        'METHOD' => $method,
        'GET' => $_GET,
        'POST_RAW' => file_get_contents('php://input'),
        'POST_PARSED' => json_decode(file_get_contents('php://input'), true)
    ], JSON_PRETTY_PRINT);
    exit;
}

try {
    // HEALTHCHECK (PUBLIC)
    if ($path === '/api/health' && $method === 'GET') {
        handleHealth();
        exit;
    }

    // PUBLIC ROUTES
    if ($path === '/api/register' && $method === 'POST') {
        handleRegister();
        exit;
    }
    
    if ($path === '/api/login' && $method === 'POST') {
        handleLogin();
        exit;
    }
    
    if ($path === '/api/forgot-password' && $method === 'POST') {
        handleForgotPassword();
        exit;
    }
    
    if ($path === '/api/projects' && $method === 'GET') {
        handleGetProjects();
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
    
    // ✅ USER INFO ENDPOINT (Verifica se há usuário/admin logado - NÃO REQUER AUTH)
    if ($path === '/api/user' && $method === 'GET') {
        handleGetUser();
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
    
    if (preg_match('#^/api/projects/(\d+)/confirm-winner$#', $path, $matches) && $method === 'POST') {
        handleConfirmWinner($matches[1]);
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
    $stmt = $db->prepare('INSERT INTO users (name, email, password, user_type, bio, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');
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
    
    // 1️⃣ PRIMEIRO: Tentar login como ADMIN na tabela admin_users
    $stmt = $db->prepare('SELECT * FROM admin_users WHERE email = ? AND is_active = TRUE');
    $stmt->execute([$email]);
    $admin = $stmt->fetch();
    
    if ($admin && password_verify($password, $admin['password'])) {
        // Atualizar último login do admin
        $stmt = $db->prepare('UPDATE admin_users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?');
        $stmt->execute([$_SERVER['REMOTE_ADDR'] ?? null, $admin['id']]);
        
        // Criar sessão de ADMIN
        $_SESSION['is_admin'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_name'] = $admin['name'];
        $_SESSION['admin_email'] = $admin['email'];
        $_SESSION['is_super_admin'] = (bool)$admin['is_super_admin'];
        $_SESSION['admin_permissions'] = $admin['permissions'] ? json_decode($admin['permissions'], true) : [];
        
        // Retornar dados do admin
        echo json_encode([
            'user_type' => 'admin',
            'admin' => [
                'id' => $admin['id'],
                'name' => $admin['name'],
                'email' => $admin['email'],
                'is_super_admin' => (bool)$admin['is_super_admin'],
                'permissions' => $admin['permissions'] ? json_decode($admin['permissions'], true) : []
            ]
        ]);
        return;
    }
    
    // 2️⃣ SEGUNDO: Tentar login como ADMIN na tabela users (user_type='admin')
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ? AND user_type = ?');
    $stmt->execute([$email, 'admin']);
    $adminUser = $stmt->fetch();
    
    if ($adminUser && password_verify($password, $adminUser['password'])) {
        // Criar sessão de ADMIN (da tabela users)
        $_SESSION['is_admin'] = true;
        $_SESSION['admin_id'] = $adminUser['id'];
        $_SESSION['admin_name'] = $adminUser['name'];
        $_SESSION['admin_email'] = $adminUser['email'];
        $_SESSION['is_super_admin'] = true; // Admin da tabela users é super admin por padrão
        $_SESSION['admin_permissions'] = [];
        $_SESSION['user_id'] = $adminUser['id']; // Também setar user_id para compatibilidade
        
        // Retornar dados do admin
        echo json_encode([
            'user_type' => 'admin',
            'admin' => [
                'id' => $adminUser['id'],
                'name' => $adminUser['name'],
                'email' => $adminUser['email'],
                'is_super_admin' => true,
                'permissions' => []
            ]
        ]);
        return;
    }
    
    // 3️⃣ DEPOIS: Tentar login como USUÁRIO COMUM
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(422);
        echo json_encode(['message' => 'As credenciais fornecidas estão incorretas.', 'errors' => ['email' => ['Credenciais inválidas']]]);
        return;
    }
    
    // Criar sessão de USUÁRIO
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
    
    try {
        // Verificar se tabela bids existe
        $tables = $db->query("SHOW TABLES LIKE 'bids'")->fetchAll();
        $hasBidsTable = count($tables) > 0;
        
        if ($hasBidsTable) {
            $stmt = $db->query('
                SELECT p.*, u.name as user_name, u.email as user_email,
                       COALESCE((SELECT COUNT(*) FROM bids WHERE project_id = p.id), 0) as bids_count
                FROM projects p
                LEFT JOIN users u ON p.contractor_id = u.id
                ORDER BY p.created_at DESC
            ');
        } else {
            // Query sem bids se tabela não existe
            $stmt = $db->query('
                SELECT p.*, u.name as user_name, u.email as user_email,
                       0 as bids_count
                FROM projects p
                LEFT JOIN users u ON p.contractor_id = u.id
                ORDER BY p.created_at DESC
            ');
        }
        
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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
            updated_at = NOW()
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
    $db = getDB();
    $stmt = $db->prepare('
        SELECT b.*, u.name as user_name, u.email as user_email
        FROM bids b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.project_id = ?
        ORDER BY b.created_at DESC
    ');
    $stmt->execute([$projectId]);
    
    echo json_encode($stmt->fetchAll());
}

function handleCreateBid() {
    $input = json_decode(file_get_contents('php://input'), true);
    $user = getCurrentUser();
    
    $db = getDB();
    $stmt = $db->prepare('
        INSERT INTO bids (project_id, user_id, amount, proposal, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    ');
    
    $stmt->execute([
        $input['project_id'] ?? 0,
        $user['id'],
        $input['amount'] ?? 0,
        $input['proposal'] ?? '',
        'pending'
    ]);
    
    echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Bid created']);
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
    $stmt = $db->prepare('UPDATE projects SET winner_bid_id = ?, status = ?, updated_at = NOW() WHERE id = ?');
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

// ==================== STUB FUNCTIONS (Payment System) ====================
// TODO: Implementar sistema de pagamentos Mercado Pago

function handleCreatePayment($projectId) {
    http_response_code(501);
    echo json_encode(['error' => 'Payment creation not implemented yet']);
}

function handleCompleteProject($projectId) {
    http_response_code(501);
    echo json_encode(['error' => 'Complete project not implemented yet']);
}

function handleMercadoPagoWebhook() {
    http_response_code(501);
    echo json_encode(['error' => 'Mercado Pago webhook not implemented yet']);
}

// ==================== STUB FUNCTIONS (Review System) ====================
// TODO: Implementar sistema de avaliações

function handleCreateReview() {
    http_response_code(501);
    echo json_encode(['error' => 'Create review not implemented yet']);
}

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
    $usersNewMonth = $pdo->query("SELECT COUNT(*) FROM users WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())")->fetchColumn();
    
    // Estatísticas de Projetos
    $projectsTotal = $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
    $projectsOpen = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'open'")->fetchColumn();
    $projectsInProgress = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'in_progress'")->fetchColumn();
    $projectsCompleted = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'completed'")->fetchColumn();
    
    // Estatísticas de Pagamentos
    $paymentsTotal = $pdo->query("SELECT COUNT(*) FROM transactions")->fetchColumn();
    $paymentsTotalAmount = $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'completed'")->fetchColumn();
    $platformFee = $paymentsTotalAmount * 0.10; // 10% de taxa
    $revenueThisMonth = $pdo->query("SELECT COALESCE(SUM(amount * 0.10), 0) FROM transactions WHERE status = 'completed' AND MONTH(created_at) = MONTH(CURRENT_DATE())")->fetchColumn();
    
    // Estatísticas de Avaliações
    $reviewsTotal = $pdo->query("SELECT COUNT(*) FROM reviews")->fetchColumn();
    $reviewsAverage = $pdo->query("SELECT COALESCE(AVG(rating), 0) FROM reviews")->fetchColumn();
    
    // Atividade dos últimos 7 dias (projetos criados por dia)
    $activity = $pdo->query("
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM projects 
        WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
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
                SET setting_value = ?, updated_at = NOW() 
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
    $stmt = $pdo->prepare("UPDATE users SET email = CONCAT('deleted_', id, '_', email), email_verified_at = NULL WHERE id = ?");
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
    
    $stmt = $pdo->prepare("UPDATE projects SET status = 'cancelled', completed_at = NOW() WHERE id = ?");
    $stmt->execute([$projectId]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Projeto não encontrado']);
        return;
    }
    
    echo json_encode(['success' => true, 'message' => 'Projeto encerrado pelo admin']);
}
