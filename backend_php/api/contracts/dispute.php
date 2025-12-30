<?php
/**
 * PUT /contracts/:id/dispute
 * Abre disputa em um contrato
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
$reason = $data['reason'] ?? null;

if (!$reason) {
    Helpers::jsonResponse(['error' => 'Motivo da disputa é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
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

    if (!in_array($contract['status'], ['in_progress', 'pending_approval'])) {
        Helpers::jsonResponse(['error' => 'Não é possível abrir disputa neste status'], 400);
    }

    // Atualizar contrato
    $stmt = $conn->prepare("
        UPDATE contracts 
        SET status = 'disputed', terms = CONCAT(COALESCE(terms, ''), '\n\n--- DISPUTA ---\n', ?), updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute(["Aberto por: {$user['userId']}\nMotivo: $reason\nData: " . date('Y-m-d H:i:s'), $contractId]);

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
        VALUES (?, ?, 'system', 'Disputa Aberta', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $otherPartyId,
        "Uma disputa foi aberta no projeto '{$contract['project_title']}'. Nossa equipe irá analisar.",
        "/contracts/" . $contractId
    ]);

    Helpers::jsonResponse([
        'message' => 'Disputa aberta com sucesso. Nossa equipe irá analisar e entrar em contato.'
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
