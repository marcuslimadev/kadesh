<?php
/**
 * POST /bids/:id/accept
 * Cliente aceita um lance
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$bidId = $_GET['id'] ?? null;

if (!$bidId) {
    Helpers::jsonResponse(['error' => 'ID do lance é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $conn->beginTransaction();

    // Buscar lance com dados do projeto
    $stmt = $conn->prepare("
        SELECT b.*, p.client_id, p.title as project_title, p.status as project_status
        FROM bids b
        JOIN projects p ON b.project_id = p.id
        WHERE b.id = ?
    ");
    $stmt->execute([$bidId]);
    $bid = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$bid) {
        Helpers::jsonResponse(['error' => 'Lance não encontrado'], 404);
    }

    // Verificar se é o dono do projeto
    if ($bid['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o dono do projeto pode aceitar lances'], 403);
    }

    // Verificar status do projeto
    if ($bid['project_status'] !== 'open') {
        Helpers::jsonResponse(['error' => 'Este projeto não está aberto para lances'], 400);
    }

    // Verificar se lance já foi aceito/rejeitado
    if ($bid['status'] !== 'pending') {
        Helpers::jsonResponse(['error' => 'Este lance já foi processado'], 400);
    }

    // Aceitar o lance
    $stmt = $conn->prepare("UPDATE bids SET status = 'accepted', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$bidId]);

    // Rejeitar outros lances do projeto
    $stmt = $conn->prepare("UPDATE bids SET status = 'rejected', updated_at = NOW() WHERE project_id = ? AND id != ?");
    $stmt->execute([$bid['project_id'], $bidId]);

    // Atualizar projeto para in_progress
    $stmt = $conn->prepare("UPDATE projects SET status = 'in_progress', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$bid['project_id']]);

    // Criar contrato
    $contractId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

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

    // Criar notificação para o provider
    $notifId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO notifications (id, user_id, type, title, content, action_url)
        VALUES (?, ?, 'bid', 'Lance Aceito!', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $bid['provider_id'],
        "Seu lance de R$ " . number_format($bid['amount'], 2, ',', '.') . " foi aceito para o projeto: " . $bid['project_title'],
        "/contracts/" . $contractId
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
