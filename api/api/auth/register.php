<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (!$name || !$email || !$password) {
    Helpers::jsonResponse(['error' => 'Nome, email e senha são obrigatórios'], 400);
}

if (!Helpers::validateEmail($email)) {
    Helpers::jsonResponse(['error' => 'Email inválido'], 400);
}

if (strlen($password) < 6) {
    Helpers::jsonResponse(['error' => 'Senha deve ter pelo menos 6 caracteres'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Verificar se usuário já existe
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        Helpers::jsonResponse(['error' => 'Email já está em uso'], 409);
    }

    // Hash da senha
    $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    
    // Gerar UUID
    $userId = Helpers::generateUUID();
    $userType = $data['user_type'] ?? 'both';

    // Inserir usuário
    $stmt = $conn->prepare("INSERT INTO users (id, name, email, password, user_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([$userId, $name, $email, $passwordHash, $userType]);

    // Buscar usuário criado
    $stmt = $conn->prepare("SELECT id, name, email, user_type, created_at FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Gerar Token
    $payload = [
        'userId' => $user['id'],
        'email' => $user['email'],
        'type' => $user['user_type'],
        'exp' => time() + (7 * 24 * 60 * 60) // 7 dias
    ];
    $token = Helpers::generateJWT($payload);

    Helpers::jsonResponse([
        'message' => 'Usuário criado com sucesso',
        'user' => $user,
        'token' => $token
    ], 201);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
