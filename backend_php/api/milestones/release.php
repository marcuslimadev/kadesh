<?php
/**
 * PUT /milestones/:id/release
 * Cliente libera pagamento do milestone
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$milestoneId = $_GET['id'] ?? null;

if (!$milestoneId) {
    Helpers::jsonResponse(['error' => 'ID do milestone é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $conn->beginTransaction();

    // Buscar milestone
    $stmt = $conn->prepare("
        SELECT m.*, c.provider_id, c.client_id, c.id as contract_id, p.title as project_title
        FROM milestones m
        JOIN contracts c ON m.contract_id = c.id
        JOIN projects p ON c.project_id = p.id
        WHERE m.id = ?
    ");
    $stmt->execute([$milestoneId]);
    $milestone = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$milestone) {
        Helpers::jsonResponse(['error' => 'Milestone não encontrado'], 404);
    }

    if ($milestone['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o cliente pode liberar o pagamento'], 403);
    }

    if ($milestone['status'] !== 'approved') {
        Helpers::jsonResponse(['error' => 'Milestone precisa estar aprovado para liberar pagamento'], 400);
    }

    // Calcular valores
    $platformFeePercent = floatval(getenv('PLATFORM_FEE_PERCENT') ?: 10);
    $amount = floatval($milestone['amount']);
    $platformFee = $amount * ($platformFeePercent / 100);
    $netAmount = $amount - $platformFee;

    // Atualizar milestone
    $stmt = $conn->prepare("UPDATE milestones SET status = 'paid', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$milestoneId]);

    // Buscar saldo atual do provider
    $stmt = $conn->prepare("
        SELECT COALESCE(balance_after, 0) as balance 
        FROM wallet_transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->execute([$milestone['provider_id']]);
    $wallet = $stmt->fetch(PDO::FETCH_ASSOC);
    $currentBalance = $wallet ? floatval($wallet['balance']) : 0;
    $newBalance = $currentBalance + $netAmount;

    // Criar transação de wallet
    $transactionId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO wallet_transactions (id, user_id, type, amount, balance_after, description, reference_type, reference_id)
        VALUES (?, ?, 'milestone_payment', ?, ?, ?, 'milestone', ?)
    ");
    $stmt->execute([
        $transactionId,
        $milestone['provider_id'],
        $netAmount,
        $newBalance,
        "Pagamento do milestone '{$milestone['title']}' (Taxa: R$ " . number_format($platformFee, 2, ',', '.') . ")",
        $milestoneId
    ]);

    // Notificar provider
    $notifId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO notifications (id, user_id, type, title, content, action_url)
        VALUES (?, ?, 'payment', 'Pagamento Liberado!', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $milestone['provider_id'],
        "Você recebeu R$ " . number_format($netAmount, 2, ',', '.') . " pelo milestone '{$milestone['title']}'",
        "/wallet"
    ]);

    $conn->commit();

    Helpers::jsonResponse([
        'message' => 'Pagamento liberado com sucesso',
        'payment' => [
            'amount' => $amount,
            'platform_fee' => $platformFee,
            'net_amount' => $netAmount
        ]
    ]);

} catch (PDOException $e) {
    $conn->rollBack();
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
