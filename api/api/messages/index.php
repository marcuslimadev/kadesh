<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$contractId = $_GET['contract_id'] ?? null;

if (!$contractId) {
    Helpers::jsonResponse(['error' => 'Contrato obrigatorio'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $stmt = $conn->prepare("SELECT id, client_id, provider_id FROM contracts WHERE id = ?");
    $stmt->execute([$contractId]);
    $contract = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$contract) {
        Helpers::jsonResponse(['error' => 'Contrato nao encontrado'], 404);
    }

    $isParticipant = ($contract['client_id'] === $user['userId'] || $contract['provider_id'] === $user['userId']);
    if (!$isParticipant) {
        Helpers::jsonResponse(['error' => 'Acesso negado'], 403);
    }

    $msgStmt = $conn->prepare("
        SELECT id, contract_id, sender_id, receiver_id, content, attachment_url, is_read, created_at
        FROM messages
        WHERE contract_id = ?
        ORDER BY created_at ASC
    ");
    $msgStmt->execute([$contractId]);
    $messages = $msgStmt->fetchAll(PDO::FETCH_ASSOC);

    Helpers::jsonResponse(['messages' => $messages]);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
