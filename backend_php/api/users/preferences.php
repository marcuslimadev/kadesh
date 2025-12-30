<?php
/**
 * GET/PUT /users/preferences
 * Gerencia preferências do usuário
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = AuthMiddleware::authenticate();

$db = new Database();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("
            SELECT timezone, language 
            FROM users WHERE id = ?
        ");
        $stmt->execute([$user['userId']]);
        $prefs = $stmt->fetch(PDO::FETCH_ASSOC);

        Helpers::jsonResponse([
            'preferences' => [
                'timezone' => $prefs['timezone'] ?? 'America/Sao_Paulo',
                'language' => $prefs['language'] ?? 'pt-BR',
                'email_notifications' => true, // TODO: implementar tabela de preferências
                'push_notifications' => true
            ]
        ]);

    } catch (PDOException $e) {
        Helpers::jsonResponse(['error' => 'Erro no banco de dados'], 500);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);

    try {
        $updates = [];
        $params = [];

        if (isset($data['timezone'])) {
            $updates[] = "timezone = ?";
            $params[] = $data['timezone'];
        }
        if (isset($data['language'])) {
            $updates[] = "language = ?";
            $params[] = $data['language'];
        }

        if (!empty($updates)) {
            $params[] = $user['userId'];
            $sql = "UPDATE users SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
        }

        Helpers::jsonResponse([
            'message' => 'Preferências atualizadas com sucesso'
        ]);

    } catch (PDOException $e) {
        Helpers::jsonResponse(['error' => 'Erro no banco de dados'], 500);
    }

} else {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}
