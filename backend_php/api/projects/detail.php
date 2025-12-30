<?php
/**
 * GET /projects/:id
 * Retorna detalhes de um projeto específico
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$projectId = $_GET['id'] ?? null;

if (!$projectId) {
    Helpers::jsonResponse(['error' => 'ID do projeto é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Buscar projeto com dados do cliente
    $stmt = $conn->prepare("
        SELECT p.*, 
               u.id as client_id, u.name as client_name, u.email as client_email, 
               u.avatar_url as client_avatar, u.location as client_location,
               (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bid_count,
               (SELECT MIN(amount) FROM bids WHERE project_id = p.id) as lowest_bid
        FROM projects p
        JOIN users u ON p.client_id = u.id
        WHERE p.id = ? AND p.status != 'deleted'
    ");
    $stmt->execute([$projectId]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$project) {
        Helpers::jsonResponse(['error' => 'Projeto não encontrado'], 404);
    }

    // Incrementar views
    $stmt = $conn->prepare("UPDATE projects SET views = views + 1 WHERE id = ?");
    $stmt->execute([$projectId]);

    // Buscar anexos
    $stmt = $conn->prepare("
        SELECT id, filename, original_name, file_url, file_size, mime_type, created_at
        FROM project_attachments 
        WHERE project_id = ?
    ");
    $stmt->execute([$projectId]);
    $attachments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatar resposta
    $response = [
        'id' => $project['id'],
        'title' => $project['title'],
        'description' => $project['description'],
        'category' => $project['category'],
        'budget' => floatval($project['budget']),
        'budget_type' => $project['budget_type'],
        'bidding_ends_at' => $project['bidding_ends_at'],
        'requirements' => $project['requirements'],
        'skills_required' => json_decode($project['skills_required'] ?? '[]'),
        'status' => $project['status'],
        'priority' => $project['priority'],
        'views' => $project['views'] + 1,
        'featured' => (bool)$project['featured'],
        'bid_count' => intval($project['bid_count']),
        'lowest_bid' => $project['lowest_bid'] ? floatval($project['lowest_bid']) : null,
        'created_at' => $project['created_at'],
        'updated_at' => $project['updated_at'],
        'client' => [
            'id' => $project['client_id'],
            'name' => $project['client_name'],
            'email' => $project['client_email'],
            'avatar_url' => $project['client_avatar'],
            'location' => $project['client_location']
        ],
        'attachments' => $attachments
    ];

    Helpers::jsonResponse($response);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
