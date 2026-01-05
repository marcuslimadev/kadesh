<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$userId = $_GET['user_id'] ?? null;
$limit = isset($_GET['limit']) ? max(1, min(intval($_GET['limit']), 50)) : 10;
$offset = isset($_GET['offset']) ? max(0, intval($_GET['offset'])) : 0;

if (!$userId) {
    Helpers::jsonResponse(['error' => 'Usuario obrigatorio'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $countStmt = $conn->prepare("SELECT COUNT(*) AS total FROM reviews WHERE reviewed_id = ? AND is_public = 1");
    $countStmt->execute([$userId]);
    $total = intval($countStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $avgStmt = $conn->prepare("SELECT AVG(rating) AS avg_rating FROM reviews WHERE reviewed_id = ? AND is_public = 1");
    $avgStmt->execute([$userId]);
    $avgRating = $avgStmt->fetch(PDO::FETCH_ASSOC)['avg_rating'] ?? null;

    $stmt = $conn->prepare("
        SELECT r.id, r.contract_id, r.reviewer_id, r.reviewed_id, r.rating, r.comment, r.created_at,
               u.name AS reviewer_name, u.avatar_url AS reviewer_avatar
        FROM reviews r
        JOIN users u ON r.reviewer_id = u.id
        WHERE r.reviewed_id = ? AND r.is_public = 1
        ORDER BY r.created_at DESC
        LIMIT :limit OFFSET :offset
    ");
    $stmt->bindValue(1, $userId);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($reviews as &$review) {
        $review['rating'] = intval($review['rating']);
    }

    Helpers::jsonResponse([
        'data' => [
            'reviews' => $reviews,
            'totalReviews' => $total,
            'avgRating' => $avgRating !== null ? floatval($avgRating) : null
        ],
        'pagination' => [
            'limit' => $limit,
            'offset' => $offset
        ]
    ]);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
