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

if (!$title || !$description || !$category || !$budget) {
    Helpers::jsonResponse(['error' => 'Campos obrigatórios ausentes'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("
        INSERT INTO projects (client_id, title, description, category, budget, bidding_ends_at, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'open', NOW(), NOW())
    ");
    
    $stmt->execute([
        $user['userId'],
        $title,
        $description,
        $category,
        $budget,
        $deadline
    ]);

    $projectId = $conn->lastInsertId();

    Helpers::jsonResponse([
        'message' => 'Projeto criado com sucesso',
        'project_id' => $projectId
    ], 201);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro ao criar projeto: ' . $e->getMessage()], 500);
}
