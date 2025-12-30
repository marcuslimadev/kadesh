<?php
/**
 * PUT /contracts/:id/cancel
 * Cancela um contrato
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$contractId = $_GET['id'] ?? null;

if (!$contractId) {
    Helpers::jsonResponse(['error' => 'ID do contrato é obrigatório'], 400);
}

$data = json_decode(file_get_contents("php://input"), true);
$reason = $data['reason'] ?? 'Não especificado';

$db = new Database();
$conn = $db->getConnection();

try {
    $conn->beginTransaction();

    // Buscar contrato
    $stmt = $conn->prepare("
        SELECT c.*, p.title as project_title 
        FROM contracts c
        JOIN projects p ON c.project_id = p.id
        WHERE c.id = ?
    ");
    $stmt->execute([$contractId]);
    $contract = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$contract) {
        Helpers::jsonResponse(['error' => 'Contrato não encontrado'], 404);
    }

    // Verificar se é parte do contrato
    if ($contract['client_id'] !== $user['userId'] && $contract['provider_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Você não faz parte deste contrato'], 403);
    }

    if ($contract['status'] === 'completed') {
        Helpers::jsonResponse(['error' => 'Não é possível cancelar contrato já concluído'], 400);
    }

    if ($contract['status'] === 'cancelled') {
        Helpers::jsonResponse(['error' => 'Contrato já está cancelado'], 400);
    }

    // Cancelar contrato
    $stmt = $conn->prepare("
        UPDATE contracts 
        SET status = 'cancelled', 
            terms = CONCAT(COALESCE(terms, ''), '\n\n--- CANCELAMENTO ---\n', ?),
            updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([
        "Cancelado por: {$user['userId']}\nMotivo: $reason\nData: " . date('Y-m-d H:i:s'),
        $contractId
    ]);

    // Reabrir projeto
    $stmt = $conn->prepare("UPDATE projects SET status = 'open', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$contract['project_id']]);

    // Reativar lance para permitir novo lance
    $stmt = $conn->prepare("UPDATE bids SET status = 'withdrawn', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$contract['bid_id']]);

    // Notificar a outra parte
    $otherPartyId = $contract['client_id'] === $user['userId'] ? $contract['provider_id'] : $contract['client_id'];
    
    $notifId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO notifications (id, user_id, type, title, content, action_url)
        VALUES (?, ?, 'system', 'Contrato Cancelado', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $otherPartyId,
        "O contrato do projeto '{$contract['project_title']}' foi cancelado. Motivo: $reason",
        "/projects/" . $contract['project_id']
    ]);

    $conn->commit();

    Helpers::jsonResponse([
        'message' => 'Contrato cancelado com sucesso'
    ]);

} catch (PDOException $e) {
    $conn->rollBack();
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
