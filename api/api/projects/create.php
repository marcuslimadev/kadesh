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
$priority = $data['priority'] ?? 3; // Default: normal
$skills_required = $data['skills_required'] ?? [];

if (!$title || !$description || !$category || !$budget) {
    Helpers::jsonResponse(['error' => 'Campos obrigatórios ausentes'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $projectId = Helpers::generateUUID();

    // Normalizar deadline: frontend envia ISO (ex.: 2026-01-15T12:00:00.000Z)
    // MySQL DATETIME espera 'Y-m-d H:i:s' sem timezone.
    $deadlineSql = null;
    if ($deadline !== null) {
        $deadlineStr = is_string($deadline) ? trim($deadline) : '';
        if ($deadlineStr !== '') {
            try {
                $dt = new DateTime($deadlineStr);
                $dt->setTimezone(new DateTimeZone('America/Sao_Paulo'));
                $deadlineSql = $dt->format('Y-m-d H:i:s');
            } catch (Throwable $e) {
                Helpers::jsonResponse(['error' => 'Prazo (deadline) inválido'], 400);
            }
        }
    }

    // Converter array de skills para JSON
    $skillsJson = json_encode($skills_required);

    $stmt = $conn->prepare("
        INSERT INTO projects (
            id, client_id, title, description, category, budget, 
            bidding_ends_at, requirements, 
            skills_required, priority, status, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', NOW(), NOW())
    ");
    
    $stmt->execute([
        $projectId,
        $user['userId'],
        $title,
        $description,
        $category,
        $budget,
        $deadlineSql,
        $requirements,
        $skillsJson,
        $priority
    ]);

    // Buscar o projeto criado para retornar no formato esperado pelo frontend
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

    // Formato esperado pelo frontend: result.data.project.id
    Helpers::jsonResponse([
        'project' => $project
    ], 201);

} catch (PDOException $e) {
    // Log detalhado do erro
    $errorDetails = [
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ];
    error_log("Erro ao criar projeto: " . json_encode($errorDetails));
    error_log("Dados enviados - title: $title, category: $category, budget: $budget");
    
    Helpers::jsonResponse([
        'error' => 'Erro ao criar projeto. Tente novamente.',
        'debug' => $e->getMessage() // Temporário para debug
    ], 500);
}
