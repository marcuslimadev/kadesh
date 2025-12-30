<?php
/**
 * PUT /milestones/:id/approve
 * Cliente aprova milestone
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$milestoneId = $_GET['id'] ?? null;

if (!$milestoneId) {
    Helpers::jsonResponse(['error' => 'ID do milestone é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Buscar milestone
    $stmt = $conn->prepare("
        SELECT m.*, c.provider_id, c.client_id, p.title as project_title
        FROM milestones m
        JOIN contracts c ON m.contract_id = c.id
        JOIN projects p ON c.project_id = p.id
        WHERE m.id = ?
    ");
    $stmt->execute([$milestoneId]);
    $milestone = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$milestone) {
        Helpers::jsonResponse(['error' => 'Milestone não encontrado'], 404);
    }

    if ($milestone['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o cliente pode aprovar o milestone'], 403);
    }

    if ($milestone['status'] !== 'submitted') {
        Helpers::jsonResponse(['error' => 'Milestone não está aguardando aprovação'], 400);
    }

    // Aprovar milestone
    $stmt = $conn->prepare("UPDATE milestones SET status = 'approved', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$milestoneId]);

    // Notificar provider
    $notifId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO notifications (id, user_id, type, title, content, action_url)
        VALUES (?, ?, 'project', 'Milestone Aprovado', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $milestone['provider_id'],
        "O milestone '{$milestone['title']}' foi aprovado pelo cliente.",
        "/contracts/" . $milestone['contract_id']
    ]);

    Helpers::jsonResponse(['message' => 'Milestone aprovado com sucesso']);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
