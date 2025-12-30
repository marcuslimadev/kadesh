<?php
/**
 * GET /users/profile
 * Retorna perfil do usuário logado
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
    $stmt = $conn->prepare("
        SELECT id, name, email, user_type, status, avatar_url, phone, bio,
               website, location, timezone, language, email_verified,
               phone_verified, created_at, updated_at
        FROM users WHERE id = ?
    ");
    $stmt->execute([$user['userId']]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
        Helpers::jsonResponse(['error' => 'Usuário não encontrado'], 404);
    }

    // Se for provider, buscar perfil adicional
    $providerProfile = null;
    if (in_array($userData['user_type'], ['provider', 'both'])) {
        $stmt = $conn->prepare("SELECT * FROM provider_profiles WHERE user_id = ?");
        $stmt->execute([$user['userId']]);
        $providerProfile = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($providerProfile && $providerProfile['skills']) {
            $providerProfile['skills'] = json_decode($providerProfile['skills']);
        }
    }

    // Buscar estatísticas
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM projects WHERE client_id = ? AND status != 'deleted'");
    $stmt->execute([$user['userId']]);
    $projectsCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM bids WHERE provider_id = ?");
    $stmt->execute([$user['userId']]);
    $bidsCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM contracts WHERE (client_id = ? OR provider_id = ?) AND status = 'completed'");
    $stmt->execute([$user['userId'], $user['userId']]);
    $completedContracts = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Buscar saldo da wallet
    $stmt = $conn->prepare("
        SELECT COALESCE(balance_after, 0) as balance 
        FROM wallet_transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->execute([$user['userId']]);
    $wallet = $stmt->fetch(PDO::FETCH_ASSOC);
    $balance = $wallet ? floatval($wallet['balance']) : 0;

    Helpers::jsonResponse([
        'user' => $userData,
        'provider_profile' => $providerProfile,
        'stats' => [
            'projects_created' => intval($projectsCount),
            'bids_submitted' => intval($bidsCount),
            'completed_contracts' => intval($completedContracts),
            'wallet_balance' => $balance
        ]
    ]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
