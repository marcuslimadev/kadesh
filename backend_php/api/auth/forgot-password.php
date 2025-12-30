<?php
/**
 * POST /auth/forgot-password
 * Solicita reset de senha
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? null;

if (!$email) {
    Helpers::jsonResponse(['error' => 'Email é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("SELECT id, name, email FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Sempre retorna sucesso para não revelar se email existe
    if (!$user) {
        Helpers::jsonResponse([
            'message' => 'Se o email existir, você receberá um link de recuperação'
        ]);
    }

    // Gerar token de reset
    $resetToken = bin2hex(random_bytes(32));
    $resetExpires = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $conn->prepare("
        UPDATE users 
        SET password_reset_token = ?, password_reset_expires = ?, updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$resetToken, $resetExpires, $user['id']]);

    // TODO: Enviar email com link de reset
    // O link seria algo como: https://seudominio.com.br/reset-password?token=$resetToken

    Helpers::jsonResponse([
        'message' => 'Se o email existir, você receberá um link de recuperação',
        // Em dev, retornar o token para testes
        'debug_token' => getenv('APP_ENV') === 'development' ? $resetToken : null
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados'], 500);
}
