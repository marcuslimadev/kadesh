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
        SELECT b.id, b.status, p.client_id, p.status AS project_status
        FROM bids b
        JOIN projects p ON b.project_id = p.id
        WHERE b.id = ?
    ");
    $stmt->execute([$bidId]);
    $bid = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$bid) {
        Helpers::jsonResponse(['error' => 'Lance nao encontrado'], 404);
    }

    if ($bid['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o dono do projeto pode rejeitar'], 403);
    }

    if ($bid['project_status'] !== 'open') {
        Helpers::jsonResponse(['error' => 'Projeto nao esta aberto'], 400);
    }

    if ($bid['status'] !== 'pending') {
        Helpers::jsonResponse(['error' => 'Lance ja processado'], 400);
    }

    $stmt = $conn->prepare("UPDATE bids SET status = 'rejected', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$bidId]);

    Helpers::jsonResponse(['message' => 'Lance rejeitado']);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
