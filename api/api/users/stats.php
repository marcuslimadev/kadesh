<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = AuthMiddleware::authenticate();
$userId = $user['userId'];
$userType = $user['type'];

$db = new Database();
$conn = $db->getConnection();

try {
    $stats = [];

    if ($userType === 'client' || $userType === 'both') {
        // Stats de cliente
        $stmt = $conn->prepare("
            SELECT 
                COUNT(*) as total_projects,
                SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_projects,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as active_projects,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects
            FROM projects WHERE client_id = ? AND status != 'deleted'
        ");
        $stmt->execute([$userId]);
        $projectStats = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("
            SELECT COUNT(*) as total_bids
            FROM bids b
            JOIN projects p ON b.project_id = p.id
            WHERE p.client_id = ? AND b.status = 'pending'
        ");
        $stmt->execute([$userId]);
        $bidStats = $stmt->fetch(PDO::FETCH_ASSOC);

        $stats = array_merge($projectStats, ['pending_bids' => (int)$bidStats['total_bids']]);
    } 
    
    if ($userType === 'provider' || $userType === 'both') {
        // Stats de provedor
        $stmt = $conn->prepare("
            SELECT 
                COUNT(*) as total_bids,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bids,
                SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_bids
            FROM bids WHERE provider_id = ? AND status != 'withdrawn'
        ");
        $stmt->execute([$userId]);
        $providerBidStats = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("
            SELECT 
                COUNT(*) as total_contracts,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as active_contracts,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_contracts,
                COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_earnings
            FROM contracts WHERE provider_id = ?
        ");
        $stmt->execute([$userId]);
        $contractStats = $stmt->fetch(PDO::FETCH_ASSOC);

        $stats = array_merge($stats, $providerBidStats, $contractStats);
    }

    Helpers::jsonResponse(['stats' => $stats]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro ao carregar estatísticas: ' . $e->getMessage()], 500);
}
