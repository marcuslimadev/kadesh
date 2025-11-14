<?php
/**
 * Kadesh Backend - Versao Producao para cPanel
 */

// Configuracao de producao
error_reporting(E_ERROR | E_PARSE);
ini_set('display_errors', 0);

// Configurar session para producao
session_set_cookie_params([
    'lifetime' => 604800,
    'path' => '/',
    'domain' => '',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

// Headers de seguranca
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Content-Type: application/json; charset=UTF-8");

// Configuracao do banco de dados
$config = require __DIR__ . '/../config/database.php';

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4",
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro de conexao com banco de dados']);
    exit;
}

// Funcao helper para resposta JSON
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Funcao para validar autenticacao
function requireAuth($pdo) {
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Nao autenticado'], 401);
    }
    
    $stmt = $pdo->prepare("SELECT id, name, email, user_type FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        session_destroy();
        jsonResponse(['error' => 'Usuario invalido'], 401);
    }
    
    return $user;
}

// Router basico
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

// Extrair path da API (agora na raiz)
$path = parse_url($path, PHP_URL_PATH);

// Remover prefixo /api/
$path = str_replace('/api/', '', $path);
$path = trim($path, '/');

$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (empty($input) && $method === 'POST') {
    $input = $_POST;
}

$route = $method . ':' . $path;

switch ($route) {
    case 'POST:login':
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        
        if (!$email || !$password) {
            jsonResponse(['error' => 'E-mail e senha sao obrigatorios'], 422);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password'])) {
            jsonResponse(['error' => 'Credenciais invalidas'], 401);
        }
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = $user['user_type'];
        
        jsonResponse([
            'message' => 'Login bem-sucedido',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'user_type' => $user['user_type']
            ]
        ]);
        break;
        
    case 'POST:register':
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $userType = $input['user_type'] ?? 'contractor';
        
        if (!$name || !$email || !$password) {
            jsonResponse(['error' => 'Nome, e-mail e senha são obrigatórios'], 422);
        }
        
        if (strlen($password) < 6) {
            jsonResponse(['error' => 'Senha deve ter pelo menos 6 caracteres'], 422);
        }
        
        // Verificar se email já existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            jsonResponse(['error' => 'Este e-mail já está cadastrado'], 422);
        }
        
        // Criar usuário
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password, user_type, created_at) 
            VALUES (?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$name, $email, $hashedPassword, $userType]);
        
        $userId = $pdo->lastInsertId();
        
        // Fazer login automático
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_type'] = $userType;
        
        jsonResponse([
            'message' => 'Conta criada com sucesso!',
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'user_type' => $userType
            ]
        ]);
        break;
        
    case 'POST:logout':
        session_destroy();
        jsonResponse(['message' => 'Logout realizado']);
        break;
        
    case 'GET:user':
        $user = requireAuth($pdo);
        jsonResponse(['user' => $user]);
        break;
        
    case 'GET:projects':
        $status = $_GET['status'] ?? 'open';
        
        $stmt = $pdo->prepare("
            SELECT p.*, u.name as user_name,
                   COUNT(b.id) as bids_count,
                   MIN(b.amount) as lowest_bid
            FROM projects p 
            LEFT JOIN users u ON p.contractor_id = u.id
            LEFT JOIN bids b ON p.id = b.project_id AND b.status = 'pending'
            WHERE p.status = ?
            GROUP BY p.id
            ORDER BY p.created_at DESC
        ");
        $stmt->execute([$status]);
        $projects = $stmt->fetchAll();
        
        jsonResponse($projects);
        break;
        
    case 'POST:bids':
        $user = requireAuth($pdo);
        
        $projectId = $input['project_id'] ?? '';
        $amount = $input['amount'] ?? '';
        $proposal = $input['proposal'] ?? '';
        $deliveryDays = $input['delivery_time_days'] ?? 30;
        
        if (!$projectId || !$amount || !$proposal) {
            jsonResponse(['error' => 'Dados obrigatorios: project_id, amount, proposal'], 422);
        }
        
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ? AND status = 'open'");
        $stmt->execute([$projectId]);
        $project = $stmt->fetch();
        
        if (!$project) {
            jsonResponse(['error' => 'Projeto nao encontrado ou nao esta ativo'], 404);
        }
        
        $stmt = $pdo->prepare("SELECT id FROM bids WHERE project_id = ? AND provider_id = ?");
        $stmt->execute([$projectId, $user['id']]);
        if ($stmt->fetch()) {
            jsonResponse(['error' => 'Voce ja fez uma proposta para este projeto'], 422);
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO bids (project_id, provider_id, amount, proposal, delivery_time_days, status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        ");
        $stmt->execute([$projectId, $user['id'], $amount, $proposal, $deliveryDays]);
        
        jsonResponse([
            'success' => true,
            'bid_id' => $pdo->lastInsertId(),
            'message' => 'Proposta enviada com sucesso!'
        ]);
        break;
        
    case 'GET:health':
        jsonResponse(['status' => 'ok', 'timestamp' => date('Y-m-d H:i:s')]);
        break;
        
    case 'GET:test':
    case 'GET:test-backend':
        // Teste completo do backend
        $response = [
            'timestamp' => date('Y-m-d H:i:s'),
            'backend_status' => 'FUNCIONANDO',
            'database_config' => [
                'host' => $config['host'],
                'dbname' => $config['dbname'], 
                'username' => $config['username']
            ]
        ];
        
        try {
            // Testar tabelas
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            $response['tables_found'] = count($tables);
            $response['table_list'] = $tables;
            
            // Testar tabela users
            if (in_array('users', $tables)) {
                $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
                $result = $stmt->fetch();
                $response['users_count'] = $result['user_count'];
                $response['users_table'] = 'EXISTS';
            } else {
                $response['users_table'] = 'NOT_FOUND';
            }
            
            $response['database_connection'] = 'SUCCESS';
        } catch (Exception $e) {
            $response['database_error'] = $e->getMessage();
        }
        
        jsonResponse($response);
        break;
        
    case 'GET:create-test-user':
        // Criar usuário de teste (apenas em desenvolvimento)
        try {
            // Verificar se usuário já existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute(['admin@kadesh.com']);
            if ($stmt->fetch()) {
                jsonResponse(['message' => 'Usuário admin@kadesh.com já existe'], 200);
            }
            
            // Criar usuário admin
            $hashedPassword = password_hash('123456', PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("
                INSERT INTO users (name, email, password, user_type, created_at) 
                VALUES (?, ?, ?, ?, NOW())
            ");
            $stmt->execute(['Admin Kadesh', 'admin@kadesh.com', $hashedPassword, 'contractor']);
            
            jsonResponse([
                'success' => true,
                'message' => 'Usuário criado com sucesso!',
                'credentials' => [
                    'email' => 'admin@kadesh.com',
                    'password' => '123456'
                ]
            ]);
        } catch (Exception $e) {
            jsonResponse(['error' => 'Erro ao criar usuário: ' . $e->getMessage()], 500);
        }
        break;
        
        default:
        if (preg_match('/^GET:projects\/(\d+)$/', $route, $matches)) {
            $projectId = $matches[1];
            
            $stmt = $pdo->prepare("
                SELECT p.*, u.name as user_name, u.email as user_email
                FROM projects p
                LEFT JOIN users u ON p.contractor_id = u.id
                WHERE p.id = ?
            ");
            $stmt->execute([$projectId]);
            $project = $stmt->fetch();
            
            if (!$project) {
                jsonResponse(['error' => 'Projeto nao encontrado'], 404);
            }
            
            jsonResponse($project);
        } else if (preg_match('/^GET:projects\/(\d+)\/bids$/', $route, $matches)) {
            $projectId = $matches[1];
            
            $user = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
            
            $stmt = $pdo->prepare("
                SELECT b.*, u.name as provider_name,
                       COALESCE(up.rating, 3.0) as provider_rating,
                       (b.amount * 0.7 + COALESCE(up.rating, 3) * 20 * 0.3) as calculated_score
                FROM bids b
                LEFT JOIN users u ON b.provider_id = u.id
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE b.project_id = ? AND b.status = 'pending'
                ORDER BY calculated_score ASC
            ");
            $stmt->execute([$projectId]);
            $bids = $stmt->fetchAll();
            
            jsonResponse(['bids' => $bids]);
        } else {
            jsonResponse(['error' => 'Rota nao encontrada: ' . $route], 404);
        }
        break;
}
?>