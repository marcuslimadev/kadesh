<?php
/**
 * PUT /contracts/:id/mark-complete
 * Provider marca contrato como completo
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

    // Verificar se é o provider
    if ($contract['provider_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o prestador pode marcar como completo'], 403);
    }

    if ($contract['status'] !== 'in_progress') {
        Helpers::jsonResponse(['error' => 'Contrato não está em andamento'], 400);
    }

    // Atualizar para pending_approval (aguardando cliente aceitar)
    $stmt = $conn->prepare("
        UPDATE contracts 
        SET status = 'pending_approval', updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$contractId]);

    // Notificar cliente
    $notifId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO notifications (id, user_id, type, title, content, action_url)
        VALUES (?, ?, 'project', 'Trabalho Concluído', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $contract['client_id'],
        "O prestador marcou o projeto '{$contract['project_title']}' como concluído. Por favor, revise e aceite.",
        "/contracts/" . $contractId
    ]);

    Helpers::jsonResponse([
        'message' => 'Contrato marcado como completo. Aguardando aprovação do cliente.'
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
