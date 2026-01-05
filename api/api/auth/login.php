<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    Helpers::jsonResponse(['error' => 'Email e senha sao obrigatorios'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexão com o banco de dados'], 500);
}

try {
    $stmt = $conn->prepare("SELECT id, name, email, password, user_type, status, created_at FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        Helpers::jsonResponse(['error' => 'Email ou senha incorretos'], 401);
    }

    if ($user['status'] !== 'active') {
        Helpers::jsonResponse(['error' => 'Conta desativada. Entre em contato com o suporte.'], 403);
    }

    $isAdmin = ($user['user_type'] === 'admin');

    $payload = [
        'userId' => $user['id'],
        'email' => $user['email'],
        'type' => $user['user_type'],
        'isAdmin' => $isAdmin,
        'exp' => time() + (7 * 24 * 60 * 60)
    ];
    $token = Helpers::generateJWT($payload);

    $stmt = $conn->prepare("UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);

    Helpers::jsonResponse([
        'message' => 'Login realizado com sucesso',
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'type' => $user['user_type'],
            'status' => $user['status'],
            'created_at' => $user['created_at'],
            'isAdmin' => $isAdmin
        ],
        'token' => $token
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
