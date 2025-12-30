<?php
/**
 * POST /admin/login
 * Login de administrador
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$email || !$password) {
    Helpers::jsonResponse(['error' => 'Email e senha são obrigatórios'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Buscar admin na tabela users
    $stmt = $conn->prepare("
        SELECT id, name, email, password, user_type, status
        FROM users 
        WHERE email = ? AND user_type = 'admin'
    ");
    $stmt->execute([$email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$admin) {
        Helpers::jsonResponse(['error' => 'Credenciais inválidas'], 401);
    }

    if (!password_verify($password, $admin['password'])) {
        Helpers::jsonResponse(['error' => 'Credenciais inválidas'], 401);
    }

    if ($admin['status'] !== 'active') {
        Helpers::jsonResponse(['error' => 'Conta de administrador desativada'], 403);
    }

    // Gerar token JWT
    $payload = [
        'userId' => $admin['id'],
        'email' => $admin['email'],
        'type' => 'admin',
        'role' => 'admin',
        'isAdmin' => true,
        'exp' => time() + (24 * 60 * 60) // 24 horas
    ];
    $token = Helpers::generateJWT($payload);

    // Atualizar último login
    $stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$admin['id']]);

    Helpers::jsonResponse([
        'message' => 'Login de administrador realizado com sucesso',
        'admin' => [
            'id' => $admin['id'],
            'name' => $admin['name'] ?? $admin['username'],
            'email' => $admin['email'],
            'role' => $admin['role'] ?? 'admin',
            'permissions' => $admin['permissions'] ? json_decode($admin['permissions']) : null
        ],
        'token' => $token
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
