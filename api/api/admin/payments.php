<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = AuthMiddleware::authenticate();
AuthMiddleware::isAdmin($user);

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['success' => false, 'error' => 'Database connection error'], 500);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
}

$search = trim($_GET['search'] ?? '');
$status = $_GET['status'] ?? '';
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$perPage = isset($_GET['per_page']) ? intval($_GET['per_page']) : (isset($_GET['limit']) ? intval($_GET['limit']) : 20);
$perPage = min(50, max(1, $perPage));
$offset = ($page - 1) * $perPage;

$where = [];
$params = [];

if ($status) {
    $where[] = 'p.status = ?';
    $params[] = $status;
}

if ($search !== '') {
    $where[] = '(u1.name LIKE ? OR u1.email LIKE ? OR u2.name LIKE ? OR u2.email LIKE ? OR p.contract_id LIKE ?)';
    $like = '%' . $search . '%';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
}

$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$countStmt = $conn->prepare("SELECT COUNT(*) as total FROM payments p $whereSql");
$countStmt->execute($params);
$total = intval($countStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

$limit = (int)$perPage;
$offsetInt = (int)$offset;

$stmt = $conn->prepare("
    SELECT p.id, p.contract_id, p.amount, p.platform_fee, p.net_amount, p.status, p.processed_at, p.created_at,
           u1.name as payer_name, u1.email as payer_email,
           u2.name as receiver_name, u2.email as receiver_email
    FROM payments p
    LEFT JOIN users u1 ON p.payer_id = u1.id
    LEFT JOIN users u2 ON p.receiver_id = u2.id
    $whereSql
    ORDER BY p.created_at DESC
    LIMIT $limit OFFSET $offsetInt
");
$stmt->execute($params);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

Helpers::jsonResponse([
    'success' => true,
    'data' => $rows,
    'pagination' => [
        'page' => $page,
        'limit' => $perPage,
        'total' => $total,
        'pages' => $perPage > 0 ? (int)ceil($total / $perPage) : 0
    ]
]);
