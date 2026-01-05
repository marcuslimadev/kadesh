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

$amount = isset($data['amount']) ? floatval($data['amount']) : 0;
$method = $data['method'] ?? 'bank_transfer';
$notes = $data['notes'] ?? null;

if ($amount <= 0) {
    Helpers::jsonResponse(['error' => 'Valor invalido'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $stmt = $conn->prepare("
        SELECT COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS available
        FROM wallet_transactions
        WHERE user_id = ?
    ");
    $stmt->execute([$user['userId']]);
    $available = floatval($stmt->fetch(PDO::FETCH_ASSOC)['available'] ?? 0);

    if ($amount > $available) {
        Helpers::jsonResponse(['error' => 'Saldo insuficiente'], 400);
    }

    $transactionId = Helpers::generateUUID();
    $balanceAfter = $available - $amount;
    $metadata = [
        'method' => $method,
        'notes' => $notes
    ];

    $stmt = $conn->prepare("
        INSERT INTO wallet_transactions (id, user_id, type, amount, balance_after, description, metadata, status)
        VALUES (?, ?, 'withdrawal', ?, ?, ?, ?, 'completed')
    ");
    $stmt->execute([
        $transactionId,
        $user['userId'],
        -abs($amount),
        $balanceAfter,
        'Saque solicitado',
        json_encode($metadata)
    ]);

    Helpers::jsonResponse([
        'message' => 'Saque registrado',
        'data' => [
            'transaction' => [
                'id' => $transactionId,
                'type' => 'withdrawal',
                'amount' => -abs($amount),
                'balance_after' => $balanceAfter,
                'status' => 'completed'
            ]
        ]
    ], 201);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
