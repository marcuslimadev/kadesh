<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

$contractId = $data['contract_id'] ?? null;
$content = trim($data['content'] ?? '');

if (!$contractId || $content === '') {
    Helpers::jsonResponse(['error' => 'Contrato e conteudo sao obrigatorios'], 400);
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

    $receiverId = $contract['client_id'] === $user['userId'] ? $contract['provider_id'] : $contract['client_id'];
    $messageId = Helpers::generateUUID();

    $stmt = $conn->prepare("
        INSERT INTO messages (id, contract_id, sender_id, receiver_id, content, is_read)
        VALUES (?, ?, ?, ?, ?, 0)
    ");
    $stmt->execute([
        $messageId,
        $contractId,
        $user['userId'],
        $receiverId,
        $content
    ]);

    Helpers::jsonResponse([
        'message' => [
            'id' => $messageId,
            'contract_id' => $contractId,
            'sender_id' => $user['userId'],
            'receiver_id' => $receiverId,
            'content' => $content,
            'is_read' => false,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ], 201);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
