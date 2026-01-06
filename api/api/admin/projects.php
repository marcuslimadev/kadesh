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

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = trim($_GET['search'] ?? '');
    $status = $_GET['status'] ?? '';
    $category = $_GET['category'] ?? '';

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $perPage = isset($_GET['per_page']) ? intval($_GET['per_page']) : (isset($_GET['limit']) ? intval($_GET['limit']) : 20);
    $perPage = min(50, max(1, $perPage));
    $offset = ($page - 1) * $perPage;

    $where = ["p.status != 'deleted'"];
    $params = [];

    if ($search !== '') {
        $where[] = '(p.title LIKE ? OR p.description LIKE ?)';
        $like = '%' . $search . '%';
        $params[] = $like;
        $params[] = $like;
    }

    if ($status) {
        $where[] = 'p.status = ?';
        $params[] = $status;
    }

    if ($category) {
        $where[] = 'p.category = ?';
        $params[] = $category;
    }

    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM projects p $whereSql");
    $countStmt->execute($params);
    $total = intval($countStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $limit = (int)$perPage;
    $offsetInt = (int)$offset;

    $stmt = $conn->prepare("
        SELECT p.id, p.title, p.category, p.budget, p.status, p.created_at, p.bidding_ends_at as deadline,
               u.name as client_name
        FROM projects p
        JOIN users u ON p.client_id = u.id
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
}

if ($method === 'PATCH' && isset($_GET['id'])) {
    $projectId = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data) || empty($data)) {
        $data = $_POST;
    }

    $status = $data['status'] ?? '';
    if ($status === '') {
        Helpers::jsonResponse(['success' => false, 'message' => 'Status is required'], 400);
    }

    $stmt = $conn->prepare("UPDATE projects SET status = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$status, $projectId]);

    Helpers::jsonResponse(['success' => true, 'message' => 'Project updated']);
}

if ($method === 'DELETE' && isset($_GET['id'])) {
    $projectId = $_GET['id'];
    $stmt = $conn->prepare("UPDATE projects SET status = 'deleted', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$projectId]);
    Helpers::jsonResponse(['success' => true, 'message' => 'Project deleted']);
}

Helpers::jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
