<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

$contractId = $data['contract_id'] ?? null;
$reviewedUserId = $data['reviewed_user_id'] ?? null;
$rating = isset($data['rating']) ? intval($data['rating']) : 0;
$comment = $data['comment'] ?? null;

if (!$contractId || !$reviewedUserId || $rating < 1 || $rating > 5) {
    Helpers::jsonResponse(['error' => 'Dados invalidos'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $stmt = $conn->prepare("SELECT id, client_id, provider_id, status FROM contracts WHERE id = ?");
    $stmt->execute([$contractId]);
    $contract = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$contract) {
        Helpers::jsonResponse(['error' => 'Contrato nao encontrado'], 404);
    }

    $isParticipant = ($contract['client_id'] === $user['userId'] || $contract['provider_id'] === $user['userId']);
    if (!$isParticipant) {
        Helpers::jsonResponse(['error' => 'Acesso negado'], 403);
    }

    $otherParty = $contract['client_id'] === $user['userId'] ? $contract['provider_id'] : $contract['client_id'];
    if ($reviewedUserId !== $otherParty) {
        Helpers::jsonResponse(['error' => 'Usuario avaliado invalido'], 400);
    }

    $stmt = $conn->prepare("SELECT id FROM reviews WHERE contract_id = ? AND reviewer_id = ?");
    $stmt->execute([$contractId, $user['userId']]);
    if ($stmt->fetch()) {
        Helpers::jsonResponse(['error' => 'Review ja enviado'], 409);
    }

    $reviewId = Helpers::generateUUID();
    $stmt = $conn->prepare("
        INSERT INTO reviews (id, contract_id, reviewer_id, reviewed_id, rating, comment, is_public)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    ");
    $stmt->execute([
        $reviewId,
        $contractId,
        $user['userId'],
        $reviewedUserId,
        $rating,
        $comment
    ]);

    $avgStmt = $conn->prepare("SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_reviews FROM reviews WHERE reviewed_id = ?");
    $avgStmt->execute([$reviewedUserId]);
    $stats = $avgStmt->fetch(PDO::FETCH_ASSOC);

    $profileStmt = $conn->prepare("SELECT id FROM provider_profiles WHERE user_id = ?");
    $profileStmt->execute([$reviewedUserId]);
    $profile = $profileStmt->fetch(PDO::FETCH_ASSOC);
    if ($profile) {
        $updateStmt = $conn->prepare("
            UPDATE provider_profiles
            SET rating = ?, total_reviews = ?, updated_at = NOW()
            WHERE user_id = ?
        ");
        $updateStmt->execute([
            floatval($stats['avg_rating'] ?? 0),
            intval($stats['total_reviews'] ?? 0),
            $reviewedUserId
        ]);
    }

    Helpers::jsonResponse([
        'message' => 'Review registrado',
        'data' => [
            'review' => [
                'id' => $reviewId,
                'contract_id' => $contractId,
                'reviewer_id' => $user['userId'],
                'reviewed_id' => $reviewedUserId,
                'rating' => $rating,
                'comment' => $comment
            ]
        ]
    ], 201);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
