<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Log para debug
error_log("=== TESTE CREATE PROJECT ===");

try {
    $user = AuthMiddleware::authenticate();
    error_log("User authenticated: " . json_encode($user));
} catch (Exception $e) {
    error_log("Auth error: " . $e->getMessage());
    Helpers::jsonResponse(['error' => 'Não autorizado: ' . $e->getMessage()], 401);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
    exit;
}

$rawInput = file_get_contents("php://input");
error_log("Raw input: " . $rawInput);

$data = json_decode($rawInput, true);
error_log("Decoded data: " . json_encode($data));

if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("JSON decode error: " . json_last_error_msg());
    Helpers::jsonResponse(['error' => 'JSON inválido: ' . json_last_error_msg()], 400);
    exit;
}

$title = $data['title'] ?? null;
$description = $data['description'] ?? null;
$category = $data['category'] ?? null;
$budget = $data['budget'] ?? null;

error_log("Title: $title, Description len: " . strlen($description ?? ''));
error_log("Category: $category, Budget: $budget");

if (!$title || !$description || !$category || !$budget) {
    $missing = [];
    if (!$title) $missing[] = 'title';
    if (!$description) $missing[] = 'description';
    if (!$category) $missing[] = 'category';
    if (!$budget) $missing[] = 'budget';
    
    error_log("Missing fields: " . implode(', ', $missing));
    Helpers::jsonResponse(['error' => 'Campos obrigatórios ausentes: ' . implode(', ', $missing)], 400);
    exit;
}

$db = new Database();
$conn = $db->getConnection();
error_log("Database connected");

try {
    $projectId = Helpers::generateUUID();
    error_log("Generated UUID: $projectId");
    
    Helpers::jsonResponse([
        'success' => true,
        'message' => 'Teste OK - dados recebidos corretamente',
        'debug' => [
            'projectId' => $projectId,
            'userId' => $user['userId'],
            'title' => $title,
            'category' => $category,
            'budget' => $budget
        ]
    ], 200);

} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    Helpers::jsonResponse(['error' => 'Erro: ' . $e->getMessage()], 500);
}
