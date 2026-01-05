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

$limit = isset($_GET['limit']) ? max(1, min(intval($_GET['limit']), 200)) : 20;
$offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;
$type = $_GET['type'] ?? null;
$status = $_GET['status'] ?? null;
$sort = strtolower($_GET['sort'] ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

$conditions = ['user_id = ?'];
$params = [$user['userId']];

if ($type) {
    $conditions[] = 'type = ?';
    $params[] = $type;
}

if ($status) {
    $conditions[] = 'status = ?';
    $params[] = $status;
}

$whereSql = implode(' AND ', $conditions);

try {
    $countStmt = $conn->prepare("SELECT COUNT(*) AS total FROM wallet_transactions WHERE $whereSql");
    $countStmt->execute($params);
    $total = intval($countStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $sql = "
        SELECT id, user_id, type, amount, balance_after, description, reference_type, reference_id, metadata, status, created_at
        FROM wallet_transactions
        WHERE $whereSql
        ORDER BY created_at $sort
        LIMIT :limit OFFSET :offset
    ";
    $stmt = $conn->prepare($sql);
    foreach ($params as $index => $value) {
        $stmt->bindValue($index + 1, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($transactions as &$transaction) {
        $transaction['amount'] = floatval($transaction['amount']);
        $transaction['balance_after'] = floatval($transaction['balance_after']);
        $transaction['metadata'] = $transaction['metadata'] ? json_decode($transaction['metadata'], true) : null;
    }

    Helpers::jsonResponse([
        'data' => [
            'transactions' => $transactions,
            'pagination' => [
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset
            ]
        ]
    ]);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
