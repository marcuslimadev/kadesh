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
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '';
$action = $_GET['action'] ?? null;
if (!$action && substr($path, -8) === '/promote') {
    $action = 'promote';
}

if ($method === 'GET' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    $stmt = $conn->prepare("
        SELECT id, name, email, user_type, status, location, created_at, last_login
        FROM users
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([$userId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        Helpers::jsonResponse(['success' => false, 'error' => 'User not found'], 404);
    }

    $payload = [
        'id' => $row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'type' => $row['user_type'],
        'status' => $row['status'],
        'location' => $row['location'],
        'created_at' => $row['created_at'],
        'last_login' => $row['last_login']
    ];

    Helpers::jsonResponse(['success' => true, 'data' => $payload]);
}

if ($method === 'GET') {
    $search = trim($_GET['search'] ?? '');
    $type = $_GET['type'] ?? '';
    $status = $_GET['status'] ?? '';

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $perPage = isset($_GET['per_page']) ? intval($_GET['per_page']) : (isset($_GET['limit']) ? intval($_GET['limit']) : 20);
    $perPage = min(50, max(1, $perPage));
    $offset = ($page - 1) * $perPage;

    $where = [];
    $params = [];

    if ($search !== '') {
        $where[] = '(name LIKE ? OR email LIKE ?)';
        $like = '%' . $search . '%';
        $params[] = $like;
        $params[] = $like;
    }

    if ($type) {
        if ($type === 'client') {
            $where[] = "user_type IN ('client', 'both')";
        } elseif ($type === 'provider') {
            $where[] = "user_type IN ('provider', 'both')";
        } else {
            $where[] = 'user_type = ?';
            $params[] = $type;
        }
    }

    if ($status) {
        $where[] = 'status = ?';
        $params[] = $status;
    }

    $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $conn->prepare("SELECT COUNT(*) as total FROM users $whereSql");
    $countStmt->execute($params);
    $total = intval($countStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $limit = (int)$perPage;
    $offsetInt = (int)$offset;

    $stmt = $conn->prepare("
        SELECT id, name, email, user_type, status, location, created_at, last_login
        FROM users
        $whereSql
        ORDER BY created_at DESC
        LIMIT $limit OFFSET $offsetInt
    ");
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = array_map(function ($row) {
        return [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'type' => $row['user_type'],
            'status' => $row['status'],
            'location' => $row['location'],
            'created_at' => $row['created_at'],
            'last_login' => $row['last_login']
        ];
    }, $rows);

    Helpers::jsonResponse([
        'success' => true,
        'data' => $data,
        'pagination' => [
            'page' => $page,
            'limit' => $perPage,
            'total' => $total,
            'pages' => $perPage > 0 ? (int)ceil($total / $perPage) : 0
        ]
    ]);
}

if ($method === 'POST' && $action === 'promote' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data) || empty($data)) {
        $data = $_POST;
    }

    $password = $data['password'] ?? null;
    if (!$password || strlen($password) < 6) {
        Helpers::jsonResponse(['success' => false, 'message' => 'Password is required (min 6 chars)'], 400);
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
        Helpers::jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("
        UPDATE users
        SET user_type = 'admin', status = 'active', password = ?, updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([$hash, $userId]);

    Helpers::jsonResponse(['success' => true, 'message' => 'User promoted to admin']);
}

if ($method === 'PATCH' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data) || empty($data)) {
        $data = $_POST;
    }

    $status = $data['status'] ?? '';
    $allowed = ['active', 'inactive', 'suspended', 'pending'];
    if (!in_array($status, $allowed, true)) {
        Helpers::jsonResponse(['success' => false, 'message' => 'Invalid status'], 400);
    }

    $stmt = $conn->prepare("UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$status, $userId]);

    Helpers::jsonResponse(['success' => true, 'message' => 'Status updated']);
}

if ($method === 'DELETE' && isset($_GET['id'])) {
    $userId = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    Helpers::jsonResponse(['success' => true, 'message' => 'User deleted']);
}

Helpers::jsonResponse(['success' => false, 'error' => 'Method not allowed'], 405);
