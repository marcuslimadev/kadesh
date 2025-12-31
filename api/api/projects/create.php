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
    $columns = [];
    $stmt = $conn->query("SHOW COLUMNS FROM projects");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $row) {
        if (!empty($row['Field'])) {
            $columns[$row['Field']] = true;
        }
    }

    $clientIdColumn = isset($columns['contractor_id']) ? 'contractor_id' : 'client_id';
    $budgetColumn = isset($columns['max_budget']) ? 'max_budget' : 'budget';
    $skillsColumn = isset($columns['required_skills']) ? 'required_skills' : 'skills_required';
    $deadlineColumn = isset($columns['bidding_ends_at']) ? 'bidding_ends_at' : (isset($columns['deadline']) ? 'deadline' : null);

    $deadlineValue = null;
    if (!empty($deadline) && $deadlineColumn) {
        try {
            $dt = new DateTime($deadline);
            $deadlineValue = $dt->format('Y-m-d H:i:s');
        } catch (Exception $e) {
            $deadlineValue = null;
        }
    }

    $projectId = Helpers::generateUUID();
    
    // Converter array de skills para JSON
    $skillsJson = json_encode($skills_required);

    $insertColumns = ['id', $clientIdColumn, 'title', 'description', 'category', $budgetColumn];
    $insertValues = [$projectId, $user['userId'], $title, $description, $category, $budget];

    if ($deadlineColumn) {
        $insertColumns[] = $deadlineColumn;
        $insertValues[] = $deadlineValue;
    }
    if (isset($columns['requirements'])) {
        $insertColumns[] = 'requirements';
        $insertValues[] = $requirements;
    }
    if (isset($columns['estimated_hours'])) {
        $insertColumns[] = 'estimated_hours';
        $insertValues[] = $estimated_hours;
    }
    if (isset($columns[$skillsColumn])) {
        $insertColumns[] = $skillsColumn;
        $insertValues[] = $skillsJson;
    }
    if (isset($columns['priority'])) {
        $insertColumns[] = 'priority';
        $insertValues[] = $priority;
    }
    if (isset($columns['status'])) {
        $insertColumns[] = 'status';
        $insertValues[] = 'open';
    }

    $placeholders = implode(',', array_fill(0, count($insertColumns), '?'));
    $columnsSql = implode(',', $insertColumns);
    $stmt = $conn->prepare("INSERT INTO projects ($columnsSql) VALUES ($placeholders)");
    $stmt->execute($insertValues);

    // Buscar o projeto criado para retornar no formato esperado pelo frontend
    $selectParts = [
        'id',
        $clientIdColumn . ' as client_id',
        'title',
        'description',
        'category',
        $budgetColumn . ' as budget'
    ];
    if ($deadlineColumn) {
        $selectParts[] = $deadlineColumn . ' as deadline';
    }
    if (isset($columns['requirements'])) {
        $selectParts[] = 'requirements';
    }
    if (isset($columns['estimated_hours'])) {
        $selectParts[] = 'estimated_hours';
    }
    if (isset($columns[$skillsColumn])) {
        $selectParts[] = $skillsColumn . ' as skills_required';
    }
    if (isset($columns['priority'])) {
        $selectParts[] = 'priority';
    }
    if (isset($columns['status'])) {
        $selectParts[] = 'status';
    }
    if (isset($columns['created_at'])) {
        $selectParts[] = 'created_at';
    }
    if (isset($columns['updated_at'])) {
        $selectParts[] = 'updated_at';
    }

    $selectSql = implode(",\n            ", $selectParts);
    $stmt = $conn->prepare("
        SELECT 
            $selectSql
        FROM projects
        WHERE id = ?
    ");
    
    $stmt->execute([$projectId]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Decodificar skills_required de JSON para array
    if ($project && isset($project['skills_required'])) {
        $decodedSkills = json_decode($project['skills_required'], true);
        $project['skills_required'] = is_array($decodedSkills) ? $decodedSkills : [];
    }

    Helpers::jsonResponse([
        'success' => true,
        'message' => 'Projeto criado com sucesso',
        'data' => [
            'project' => $project
        ]
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
