<?php
/**
 * POST /projects/:id/accept-bid
 * Cliente aceita um lance para o projeto
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$projectId = $_GET['id'] ?? null;
$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}
$bidId = $data['bid_id'] ?? null;

if (!$projectId || !$bidId) {
    Helpers::jsonResponse(['error' => 'Projeto e lance sao obrigatorios'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $conn->beginTransaction();

    $stmt = $conn->prepare("
        SELECT b.*, p.client_id, p.title as project_title, p.status as project_status
        FROM bids b
        JOIN projects p ON b.project_id = p.id
        WHERE b.id = ? AND p.id = ?
    ");
    $stmt->execute([$bidId, $projectId]);
    $bid = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$bid) {
        Helpers::jsonResponse(['error' => 'Lance nao encontrado'], 404);
    }

    if ($bid['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o dono do projeto pode aceitar lances'], 403);
    }

    if ($bid['project_status'] !== 'open') {
        Helpers::jsonResponse(['error' => 'Este projeto nao esta aberto para lances'], 400);
    }

    if ($bid['status'] !== 'pending') {
        Helpers::jsonResponse(['error' => 'Este lance ja foi processado'], 400);
    }

    $stmt = $conn->prepare("UPDATE bids SET status = 'accepted', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$bidId]);

    $stmt = $conn->prepare("UPDATE bids SET status = 'rejected', updated_at = NOW() WHERE project_id = ? AND id != ?");
    $stmt->execute([$bid['project_id'], $bidId]);

    $stmt = $conn->prepare("UPDATE projects SET status = 'in_progress', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$bid['project_id']]);

    $contractId = Helpers::generateUUID();
    $stmt = $conn->prepare("
        INSERT INTO contracts (id, project_id, client_id, provider_id, bid_id, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, 'in_progress')
    ");
    $stmt->execute([
        $contractId,
        $bid['project_id'],
        $bid['client_id'],
        $bid['provider_id'],
        $bidId,
        $bid['amount']
    ]);

    $notifId = Helpers::generateUUID();
    $stmt = $conn->prepare("
        INSERT INTO notifications (id, user_id, type, title, content, action_url)
        VALUES (?, ?, 'bid', 'Lance Aceito!', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $bid['provider_id'],
        'Seu lance foi aceito para o projeto: ' . $bid['project_title'],
        '/contracts/' . $contractId
    ]);

    $conn->commit();

    Helpers::jsonResponse([
        'message' => 'Lance aceito com sucesso',
        'contract_id' => $contractId
    ]);
} catch (PDOException $e) {
    $conn->rollBack();
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
