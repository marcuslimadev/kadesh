<?php
/**
 * GET /projects/my-projects
 * Retorna projetos do usuário logado
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

    $whereClause = "WHERE p.client_id = ? AND p.status != 'deleted'";
    $params = [$user['userId']];

    if ($status) {
        $whereClause .= " AND p.status = ?";
        $params[] = $status;
    }

    // Contar total
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM projects p $whereClause");
    $stmt->execute($params);
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Buscar projetos
    $limit = (int) $perPage;
    $offsetInt = (int) $offset;
    
    $stmt = $conn->prepare("
        SELECT p.*,
               (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bid_count,
               (SELECT MIN(amount) FROM bids WHERE project_id = p.id) as lowest_bid
        FROM projects p
        $whereClause
        ORDER BY p.created_at DESC
        LIMIT $limit OFFSET $offsetInt
    ");
    $stmt->execute($params);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Helpers::jsonResponse([
        'projects' => $projects,
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
