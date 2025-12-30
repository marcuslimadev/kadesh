<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = AuthMiddleware::authenticate();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$data = json_decode(file_get_contents("php://input"), true);

$projectId = $data['project_id'] ?? null;
$amount = $data['amount'] ?? null;
$proposal = $data['proposal'] ?? null;
$deliveryTime = $data['delivery_time'] ?? null;

if (!$projectId || !$amount || !$proposal) {
    Helpers::jsonResponse(['error' => 'Campos obrigatórios ausentes'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Verificar se o projeto existe e está aberto
    $stmt = $conn->prepare("SELECT status FROM projects WHERE id = ?");
    $stmt->execute([$projectId]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$project || $project['status'] !== 'open') {
        Helpers::jsonResponse(['error' => 'Projeto não disponível para lances'], 400);
    }

    // Inserir lance
    $stmt = $conn->prepare("
        INSERT INTO bids (project_id, provider_id, amount, proposal, delivery_time, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'pending', NOW(), NOW())
        ON DUPLICATE KEY UPDATE amount = VALUES(amount), proposal = VALUES(proposal), delivery_time = VALUES(delivery_time), updated_at = NOW()
    ");
    
    $stmt->execute([
        $projectId,
        $user['userId'],
        $amount,
        $proposal,
        $deliveryTime
    ]);

    Helpers::jsonResponse(['message' => 'Lance enviado com sucesso'], 201);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro ao enviar lance: ' . $e->getMessage()], 500);
}
