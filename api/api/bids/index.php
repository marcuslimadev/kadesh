<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = AuthMiddleware::authenticate();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$projectId = $_GET['project_id'] ?? null;

if (!$projectId) {
    Helpers::jsonResponse(['error' => 'ID do projeto é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    // Buscar todos os bids do projeto com informações do provider
    $stmt = $conn->prepare("
        SELECT 
            b.id, 
            b.project_id,
            b.provider_id,
            b.amount, 
            b.proposal, 
            b.delivery_time, 
            b.status, 
            b.created_at, 
            b.updated_at,
            u.id as provider_id,
            u.name as provider_name,
            u.email as provider_email,
            u.avatar_url as provider_avatar,
            u.location as provider_location,
            (SELECT AVG(rating) FROM reviews WHERE provider_id = b.provider_id) as provider_rating,
            (SELECT COUNT(*) FROM reviews WHERE provider_id = b.provider_id) as provider_reviews_count
        FROM bids b
        JOIN users u ON b.provider_id = u.id
        WHERE b.project_id = ?
        ORDER BY b.amount ASC, b.created_at ASC
    ");
    
    $stmt->execute([$projectId]);
    $bids = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formatar resposta
    $formattedBids = array_map(function($bid) {
        return [
            'id' => $bid['id'],
            'project_id' => $bid['project_id'],
            'amount' => floatval($bid['amount']),
            'proposal' => $bid['proposal'],
            'delivery_time' => $bid['delivery_time'] ? intval($bid['delivery_time']) : null,
            'status' => $bid['status'],
            'created_at' => $bid['created_at'],
            'updated_at' => $bid['updated_at'],
            'provider' => [
                'id' => $bid['provider_id'],
                'name' => $bid['provider_name'],
                'email' => $bid['provider_email'],
                'avatar_url' => $bid['provider_avatar'],
                'location' => $bid['provider_location'],
                'rating' => $bid['provider_rating'] ? floatval($bid['provider_rating']) : null,
                'reviews_count' => intval($bid['provider_reviews_count'])
            ]
        ];
    }, $bids);

    Helpers::jsonResponse([
        'bids' => $formattedBids,
        'count' => count($formattedBids)
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro ao buscar propostas: ' . $e->getMessage()], 500);
}

