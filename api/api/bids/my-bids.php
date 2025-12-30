<?php
/**
 * GET /bids/my-bids
 * Retorna lances do usuário logado
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();

$db = new Database();
$conn = $db->getConnection();

try {
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $perPage = isset($_GET['per_page']) ? min(50, max(1, intval($_GET['per_page']))) : 10;
    $offset = ($page - 1) * $perPage;
    $status = $_GET['status'] ?? null;

    $whereClause = "WHERE b.provider_id = ?";
    $params = [$user['userId']];

    if ($status) {
        $whereClause .= " AND b.status = ?";
        $params[] = $status;
    }

    // Contar total
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM bids b $whereClause");
    $stmt->execute($params);
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Buscar lances com dados do projeto
    $params[] = $perPage;
    $params[] = $offset;

    $stmt = $conn->prepare("
        SELECT b.*, 
               p.title as project_title, p.category, p.budget as project_budget, 
               p.status as project_status, p.bidding_ends_at,
               u.name as client_name
        FROM bids b
        JOIN projects p ON b.project_id = p.id
        JOIN users u ON p.client_id = u.id
        $whereClause
        ORDER BY b.created_at DESC
        LIMIT ? OFFSET ?
    ");
    $stmt->execute($params);
    $bids = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Helpers::jsonResponse([
        'bids' => $bids,
        'pagination' => [
            'page' => $page,
            'per_page' => $perPage,
            'total' => intval($total),
            'total_pages' => ceil($total / $perPage)
        ]
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
