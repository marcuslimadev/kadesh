<?php
/**
 * GET /users/:id/public
 * Retorna perfil público de um usuário
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$userId = $_GET['id'] ?? null;

if (!$userId) {
    Helpers::jsonResponse(['error' => 'ID do usuário é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $stmt = $conn->prepare("
        SELECT id, name, user_type, avatar_url, bio, location, created_at
        FROM users 
        WHERE id = ? AND status = 'active'
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        Helpers::jsonResponse(['error' => 'Usuário não encontrado'], 404);
    }

    // Buscar perfil de provider se aplicável
    $providerProfile = null;
    if (in_array($user['user_type'], ['provider', 'both'])) {
        $stmt = $conn->prepare("
            SELECT title, hourly_rate, skills, experience_years, 
                   portfolio_url, github_url, linkedin_url, availability,
                   rating, total_reviews, total_projects, total_earnings
            FROM provider_profiles WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        $providerProfile = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($providerProfile && $providerProfile['skills']) {
            $providerProfile['skills'] = json_decode($providerProfile['skills']);
        }
    }

    // Buscar estatísticas públicas
    $stmt = $conn->prepare("
        SELECT COUNT(*) as count FROM projects 
        WHERE client_id = ? AND status = 'completed'
    ");
    $stmt->execute([$userId]);
    $completedProjects = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Buscar avaliações recebidas
    $stmt = $conn->prepare("
        SELECT r.rating, r.comment, r.created_at, u.name as reviewer_name
        FROM reviews r
        JOIN users u ON r.reviewer_id = u.id
        WHERE r.reviewed_id = ? AND r.is_public = 1
        ORDER BY r.created_at DESC
        LIMIT 5
    ");
    $stmt->execute([$userId]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calcular média de avaliações
    $stmt = $conn->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE reviewed_id = ?");
    $stmt->execute([$userId]);
    $ratingStats = $stmt->fetch(PDO::FETCH_ASSOC);

    Helpers::jsonResponse([
        'user' => $user,
        'provider_profile' => $providerProfile,
        'stats' => [
            'completed_projects' => intval($completedProjects),
            'average_rating' => $ratingStats['avg_rating'] ? round(floatval($ratingStats['avg_rating']), 2) : null,
            'total_reviews' => intval($ratingStats['total'])
        ],
        'recent_reviews' => $reviews
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
