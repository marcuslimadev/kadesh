<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $stmt = $conn->prepare("
        SELECT
            COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS completed_total,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) AS pending_total,
            COALESCE(SUM(CASE WHEN type = 'escrow_hold' AND status = 'completed' THEN ABS(amount) ELSE 0 END), 0) AS escrow_hold,
            COALESCE(SUM(CASE WHEN type = 'escrow_release' AND status = 'completed' THEN ABS(amount) ELSE 0 END), 0) AS escrow_release
        FROM wallet_transactions
        WHERE user_id = ?
    ");
    $stmt->execute([$user['userId']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $completedTotal = floatval($row['completed_total'] ?? 0);
    $pendingTotal = floatval($row['pending_total'] ?? 0);
    $escrowHold = floatval($row['escrow_hold'] ?? 0);
    $escrowRelease = floatval($row['escrow_release'] ?? 0);
    $escrow = max(0, $escrowHold - $escrowRelease);

    Helpers::jsonResponse([
        'data' => [
            'available' => $completedTotal,
            'escrow' => $escrow,
            'pending' => $pendingTotal,
            'total' => $completedTotal + $escrow
        ]
    ]);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
