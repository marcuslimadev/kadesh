<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$db = new Database();
$conn = $db->getConnection();

try {
    $status = $_GET['status'] ?? 'open';
    $category = $_GET['category'] ?? null;
    $budgetMax = isset($_GET['budget_max']) ? floatval($_GET['budget_max']) : null;
    $featured = $_GET['featured'] ?? null;

    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $perPage = isset($_GET['per_page']) ? min(50, max(1, intval($_GET['per_page']))) : 20;
    $offset = ($page - 1) * $perPage;

    $where = ["p.status != 'deleted'"];
    $params = [];

    if ($status) {
        $where[] = 'p.status = ?';
        $params[] = $status;
    }

    if ($category) {
        $where[] = 'p.category = ?';
        $params[] = $category;
    }

    if ($budgetMax !== null && $budgetMax > 0) {
        $where[] = 'p.budget <= ?';
        $params[] = $budgetMax;
    }

    if ($featured !== null) {
        $isFeatured = ($featured === 'true' || $featured === '1' || $featured === 1 || $featured === true);
        if ($isFeatured) {
            $where[] = 'p.featured = 1';
        }
    }

    $whereSql = 'WHERE ' . implode(' AND ', $where);

    // Total
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM projects p $whereSql");
    $stmt->execute($params);
    $total = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    // Lista
        $limit = (int)$perPage;
        $offsetInt = (int)$offset;

        $sql = "SELECT p.*, u.name as client_name
            FROM projects p
            JOIN users u ON p.client_id = u.id
            $whereSql
            ORDER BY p.created_at DESC
            LIMIT $limit OFFSET $offsetInt";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Helpers::jsonResponse([
        'projects' => $projects,
        'pagination' => [
            'page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'total_pages' => $perPage > 0 ? (int)ceil($total / $perPage) : 0
        ]
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro ao buscar projetos: ' . $e->getMessage()], 500);
}
