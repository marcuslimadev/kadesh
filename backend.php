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

session_set_cookie_params([
    'lifetime' => 0,              // Sessão expira ao fechar navegador
    'path' => '/kadesh/',         // Cookie só enviado em /kadesh/*
    'domain' => '',               // Vazio = usa domínio atual automaticamente
    'secure' => $isProduction,    // true em HTTPS (produção), false em HTTP (local)
    'httponly' => true,           // Previne acesso via JavaScript
    'samesite' => 'Lax'           // Permite envio em navegação normal
]);

// Start session ANTES de qualquer output
session_start();

// Headers
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
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthenticated']);
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

// Remover /kadesh do path se existir (para funcionar em subpasta)
$path = preg_replace('#^/kadesh#', '', $path);

// Garantir que path começa com /
if (!empty($path) && $path[0] !== '/') {
    $path = '/' . $path;
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
    
    // PROTECTED ROUTES
    requireAuth();
    
    if ($path === '/api/logout' && $method === 'POST') {
        handleLogout();
        exit;
    }
    
    if ($path === '/api/user' && $method === 'GET') {
        handleGetUser();
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
    
    // 404
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found', 'path' => $path]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error', 'error' => $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error', 'error' => $e->getMessage()]);
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
        echo json_encode(['message' => 'Validation failed', 'errors' => ['email' => ['Required fields missing']]]);
        return;
    }
    
    $db = getDB();
    
    // Check if email exists
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(422);
        echo json_encode(['message' => 'Validation failed', 'errors' => ['email' => ['Email already exists']]]);
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
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(422);
        echo json_encode(['message' => 'The provided credentials are incorrect.', 'errors' => ['email' => ['Invalid credentials']]]);
        return;
    }
    
    $_SESSION['user_id'] = $user['id'];
    
    echo json_encode([
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
        echo json_encode(['message' => 'Email é obrigatório', 'errors' => ['email' => ['Email required']]]);
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
    echo json_encode(['message' => 'Logged out successfully']);
}

function handleGetUser() {
    $user = getCurrentUser();
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
            'message' => 'Database error', 
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
