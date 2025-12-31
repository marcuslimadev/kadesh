<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = AuthMiddleware::authenticate();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? null;
$description = $data['description'] ?? null;
$category = $data['category'] ?? null;
$budget = $data['budget'] ?? null;
$deadline = $data['deadline'] ?? null;
$requirements = $data['requirements'] ?? null;
$estimated_hours = $data['estimated_hours'] ?? null;
$priority = $data['priority'] ?? 3; // Default: normal
$skills_required = $data['skills_required'] ?? [];

if (!$title || !$description || !$category || !$budget) {
    Helpers::jsonResponse(['error' => 'Campos obrigatórios ausentes'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $projectId = Helpers::generateUUID();
    
    // Converter array de skills para JSON
    $skillsJson = json_encode($skills_required);
    
    $stmt = $conn->prepare("
        INSERT INTO projects (
            id, client_id, title, description, category, budget, 
            bidding_ends_at, requirements, estimated_hours, 
            skills_required, priority, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', NOW(), NOW())
    ");

    $stmt->execute([
        $projectId,
        $user['userId'],
        $title,
        $description,
        $category,
        $budget,
        $deadline,
        $requirements,
        $estimated_hours,
        $skillsJson,
        $priority
    ]);

    // Buscar o projeto criado para retornar
    $stmt = $conn->prepare("
        SELECT 
            id,
            client_id,
            title,
            description,
            category,
            budget,
            bidding_ends_at as deadline,
            requirements,
            estimated_hours,
            skills_required,
            priority,
            status,
            created_at,
            updated_at
        FROM projects
        WHERE id = ?
    ");
    
    $stmt->execute([$projectId]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Decodificar skills_required de JSON para array
    if ($project && isset($project['skills_required'])) {
        $project['skills_required'] = json_decode($project['skills_required'], true) ?? [];
    }

    Helpers::jsonResponse([
        'success' => true,
        'message' => 'Projeto criado com sucesso',
        'data' => [
            'project' => $project
        ]
    ], 201);

} catch (PDOException $e) {
    error_log("Erro ao criar projeto: " . $e->getMessage());
    Helpers::jsonResponse(['error' => 'Erro ao criar projeto. Tente novamente.'], 500);
}
