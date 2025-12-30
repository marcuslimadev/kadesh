<?php
/**
 * POST /contracts
 * Cria um novo contrato (geralmente após aceitar lance)
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$data = json_decode(file_get_contents("php://input"), true);

$projectId = $data['project_id'] ?? null;
$bidId = $data['bid_id'] ?? null;

if (!$projectId || !$bidId) {
    Helpers::jsonResponse(['error' => 'project_id e bid_id são obrigatórios'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $conn->beginTransaction();

    // Buscar projeto
    $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ?");
    $stmt->execute([$projectId]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$project) {
        Helpers::jsonResponse(['error' => 'Projeto não encontrado'], 404);
    }

    if ($project['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o dono do projeto pode criar contratos'], 403);
    }

    // Buscar lance
    $stmt = $conn->prepare("SELECT * FROM bids WHERE id = ? AND project_id = ?");
    $stmt->execute([$bidId, $projectId]);
    $bid = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$bid) {
        Helpers::jsonResponse(['error' => 'Lance não encontrado'], 404);
    }

    // Verificar se já existe contrato para este projeto
    $stmt = $conn->prepare("SELECT id FROM contracts WHERE project_id = ? AND status NOT IN ('cancelled', 'deleted')");
    $stmt->execute([$projectId]);
    if ($stmt->fetch()) {
        Helpers::jsonResponse(['error' => 'Já existe um contrato ativo para este projeto'], 400);
    }

    // Criar contrato
    $contractId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $terms = $data['terms'] ?? null;
    $endDate = $data['end_date'] ?? null;

    $stmt = $conn->prepare("
        INSERT INTO contracts (id, project_id, client_id, provider_id, bid_id, amount, terms, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'in_progress')
    ");
    $stmt->execute([
        $contractId,
        $projectId,
        $project['client_id'],
        $bid['provider_id'],
        $bidId,
        $bid['amount'],
        $terms,
        $endDate
    ]);

    // Atualizar status do lance e projeto
    $stmt = $conn->prepare("UPDATE bids SET status = 'accepted', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$bidId]);

    $stmt = $conn->prepare("UPDATE projects SET status = 'in_progress', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$projectId]);

    $conn->commit();

    // Retornar contrato criado
    $stmt = $conn->prepare("SELECT * FROM contracts WHERE id = ?");
    $stmt->execute([$contractId]);
    $contract = $stmt->fetch(PDO::FETCH_ASSOC);

    Helpers::jsonResponse([
        'message' => 'Contrato criado com sucesso',
        'contract' => $contract
    ], 201);

} catch (PDOException $e) {
    $conn->rollBack();
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
