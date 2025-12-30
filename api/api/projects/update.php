<?php
/**
 * PUT /projects/:id
 * Atualiza um projeto existente
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$projectId = $_GET['id'] ?? null;

if (!$projectId) {
    Helpers::jsonResponse(['error' => 'ID do projeto é obrigatório'], 400);
}

$data = json_decode(file_get_contents("php://input"), true);

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

    if ($project['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Sem permissão para editar este projeto'], 403);
    }

    // Não permitir edição se já tiver lances aceitos
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM bids WHERE project_id = ? AND status = 'accepted'");
    $stmt->execute([$projectId]);
    $acceptedBids = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($acceptedBids['count'] > 0) {
        Helpers::jsonResponse(['error' => 'Não é possível editar projeto com lance aceito'], 400);
    }

    // Campos atualizáveis
    $title = $data['title'] ?? $project['title'];
    $description = $data['description'] ?? $project['description'];
    $category = $data['category'] ?? $project['category'];
    $budget = $data['budget'] ?? $project['budget'];
    $budgetType = $data['budget_type'] ?? $project['budget_type'];
    $biddingEndsAt = $data['bidding_ends_at'] ?? $project['bidding_ends_at'];
    $requirements = $data['requirements'] ?? $project['requirements'];
    $skillsRequired = isset($data['skills_required']) ? json_encode($data['skills_required']) : $project['skills_required'];
    $priority = $data['priority'] ?? $project['priority'];

    $stmt = $conn->prepare("
        UPDATE projects SET
            title = ?, description = ?, category = ?, budget = ?, budget_type = ?,
            bidding_ends_at = ?, requirements = ?, skills_required = ?, priority = ?,
            updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([
        $title, $description, $category, $budget, $budgetType,
        $biddingEndsAt, $requirements, $skillsRequired, $priority,
        $projectId
    ]);

    // Retornar projeto atualizado
    $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->execute([$projectId]);
    $updatedProject = $stmt->fetch(PDO::FETCH_ASSOC);

    Helpers::jsonResponse([
        'message' => 'Projeto atualizado com sucesso',
        'project' => $updatedProject
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
