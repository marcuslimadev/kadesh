<?php
/**
 * DELETE /milestones/:id
 * Remove um milestone
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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
        SELECT m.*, c.client_id, c.provider_id
        FROM milestones m
        JOIN contracts c ON m.contract_id = c.id
        WHERE m.id = ?
    ");
    $stmt->execute([$milestoneId]);
    $milestone = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$milestone) {
        Helpers::jsonResponse(['error' => 'Milestone não encontrado'], 404);
    }

    // Verificar permissão (cliente ou provider do contrato)
    if ($milestone['client_id'] !== $user['userId'] && $milestone['provider_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Sem permissão para excluir este milestone'], 403);
    }

    // Não pode excluir milestone pago
    if ($milestone['status'] === 'paid') {
        Helpers::jsonResponse(['error' => 'Não é possível excluir milestone já pago'], 400);
    }

    // Excluir
    $stmt = $conn->prepare("DELETE FROM milestones WHERE id = ?");
    $stmt->execute([$milestoneId]);

    Helpers::jsonResponse(['message' => 'Milestone excluído com sucesso']);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
