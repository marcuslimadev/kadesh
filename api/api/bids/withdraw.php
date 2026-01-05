<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$bidId = $_GET['id'] ?? null;

if (!$bidId) {
    Helpers::jsonResponse(['error' => 'ID do lance obrigatorio'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $stmt = $conn->prepare("
        SELECT id, provider_id, status
        FROM bids
        WHERE id = ?
    ");
    $stmt->execute([$bidId]);
    $bid = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$bid) {
        Helpers::jsonResponse(['error' => 'Lance nao encontrado'], 404);
    }

    if ($bid['provider_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o prestador pode retirar'], 403);
    }

    if ($bid['status'] !== 'pending') {
        Helpers::jsonResponse(['error' => 'Lance ja processado'], 400);
    }

    $stmt = $conn->prepare("UPDATE bids SET status = 'withdrawn', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$bidId]);

    Helpers::jsonResponse(['message' => 'Lance retirado']);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
