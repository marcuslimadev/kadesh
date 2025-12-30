<?php
/**
 * POST /auth/reset-password
 * Reseta a senha usando token
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? null;
$password = $data['password'] ?? null;

if (!$token || !$password) {
    Helpers::jsonResponse(['error' => 'Token e nova senha são obrigatórios'], 400);
}

if (strlen($password) < 6) {
    Helpers::jsonResponse(['error' => 'Senha deve ter no mínimo 6 caracteres'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("
        SELECT id, email, password_reset_expires 
        FROM users 
        WHERE password_reset_token = ?
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        Helpers::jsonResponse(['error' => 'Token inválido ou expirado'], 400);
    }

    if (strtotime($user['password_reset_expires']) < time()) {
        Helpers::jsonResponse(['error' => 'Token expirado. Solicite novo reset.'], 400);
    }

    // Atualizar senha
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("
        UPDATE users 
        SET password = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$hashedPassword, $user['id']]);

    Helpers::jsonResponse([
        'message' => 'Senha alterada com sucesso'
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados'], 500);
}
