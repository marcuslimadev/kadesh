<?php
/**
 * DELETE /projects/:id
 * Remove um projeto (soft delete)
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$projectId = $_GET['id'] ?? null;

if (!$projectId) {
    Helpers::jsonResponse(['error' => 'ID do projeto é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Verificar se projeto existe e pertence ao usuário
    $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ? AND status != 'deleted'");
    $stmt->execute([$projectId]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$project) {
        Helpers::jsonResponse(['error' => 'Projeto não encontrado'], 404);
    }

    // Verificar permissão (dono ou admin)
    $isAdmin = isset($user['isAdmin']) && $user['isAdmin'];
    if ($project['client_id'] !== $user['userId'] && !$isAdmin) {
        Helpers::jsonResponse(['error' => 'Sem permissão para excluir este projeto'], 403);
    }

    // Verificar se tem contrato ativo
    $stmt = $conn->prepare("
        SELECT COUNT(*) as count FROM contracts 
        WHERE project_id = ? AND status IN ('in_progress', 'open')
    ");
    $stmt->execute([$projectId]);
    $activeContracts = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($activeContracts['count'] > 0) {
        Helpers::jsonResponse(['error' => 'Não é possível excluir projeto com contrato ativo'], 400);
    }

    // Soft delete
    $stmt = $conn->prepare("UPDATE projects SET status = 'deleted', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$projectId]);

    Helpers::jsonResponse([
        'message' => 'Projeto excluído com sucesso'
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
