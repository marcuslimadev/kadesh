<?php
/**
 * GET /auth/verify
 * Verifica token JWT e retorna dados do usuário
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();

$db = new Database();
$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("
        SELECT id, name, email, user_type, status, avatar_url, phone, bio, 
               location, created_at, last_login
        FROM users WHERE id = ?
    ");
    $stmt->execute([$user['userId']]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
        Helpers::jsonResponse(['error' => 'Usuário não encontrado'], 404);
    }

    $isAdmin = ($userData['user_type'] === 'admin');

    Helpers::jsonResponse([
        'user' => [
            'id' => $userData['id'],
            'name' => $userData['name'],
            'email' => $userData['email'],
            'type' => $userData['user_type'],
            'status' => $userData['status'],
            'avatar_url' => $userData['avatar_url'],
            'phone' => $userData['phone'],
            'bio' => $userData['bio'],
            'location' => $userData['location'],
            'created_at' => $userData['created_at'],
            'last_login' => $userData['last_login'],
            'isAdmin' => $isAdmin
        ]
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados'], 500);
}
