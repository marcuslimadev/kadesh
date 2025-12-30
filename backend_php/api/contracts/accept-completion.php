<?php
/**
 * PUT /contracts/:id/accept-completion
 * Cliente aceita a conclusão e libera pagamento
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$contractId = $_GET['id'] ?? null;

if (!$contractId) {
    Helpers::jsonResponse(['error' => 'ID do contrato é obrigatório'], 400);
}

$db = new Database();
$conn = $db->getConnection();

try {
    $conn->beginTransaction();

    // Buscar contrato
    $stmt = $conn->prepare("
        SELECT c.*, p.title as project_title 
        FROM contracts c
        JOIN projects p ON c.project_id = p.id
        WHERE c.id = ?
    ");
    $stmt->execute([$contractId]);
    $contract = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$contract) {
        Helpers::jsonResponse(['error' => 'Contrato não encontrado'], 404);
    }

    // Verificar se é o cliente
    if ($contract['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o cliente pode aceitar a conclusão'], 403);
    }

    if (!in_array($contract['status'], ['in_progress', 'pending_approval'])) {
        Helpers::jsonResponse(['error' => 'Contrato não está aguardando aprovação'], 400);
    }

    // Calcular valores
    $platformFeePercent = floatval(getenv('PLATFORM_FEE_PERCENT') ?: 10);
    $amount = floatval($contract['amount']);
    $platformFee = $amount * ($platformFeePercent / 100);
    $netAmount = $amount - $platformFee;

    // Atualizar contrato
    $stmt = $conn->prepare("
        UPDATE contracts 
        SET status = 'completed', actual_completion_date = NOW(), updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$contractId]);

    // Atualizar projeto
    $stmt = $conn->prepare("UPDATE projects SET status = 'completed', updated_at = NOW() WHERE id = ?");
    $stmt->execute([$contract['project_id']]);

    // Buscar saldo atual do provider
    $stmt = $conn->prepare("
        SELECT COALESCE(balance_after, 0) as balance 
        FROM wallet_transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
    ");
    $stmt->execute([$contract['provider_id']]);
    $wallet = $stmt->fetch(PDO::FETCH_ASSOC);
    $currentBalance = $wallet ? floatval($wallet['balance']) : 0;
    $newBalance = $currentBalance + $netAmount;

    // Criar transação de wallet para provider
    $transactionId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO wallet_transactions (id, user_id, type, amount, balance_after, description, reference_type, reference_id)
        VALUES (?, ?, 'payment', ?, ?, ?, 'contract', ?)
    ");
    $stmt->execute([
        $transactionId,
        $contract['provider_id'],
        $netAmount,
        $newBalance,
        "Pagamento pelo projeto: {$contract['project_title']} (Taxa: R$ " . number_format($platformFee, 2, ',', '.') . ")",
        $contractId
    ]);

    // Criar registro de pagamento
    $paymentId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    $stmt = $conn->prepare("
        INSERT INTO payments (id, contract_id, payer_id, receiver_id, amount, platform_fee, net_amount, status, processed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', NOW())
    ");
    $stmt->execute([
        $paymentId,
        $contractId,
        $contract['client_id'],
        $contract['provider_id'],
        $amount,
        $platformFee,
        $netAmount
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
        VALUES (?, ?, 'payment', 'Pagamento Recebido!', ?, ?)
    ");
    $stmt->execute([
        $notifId,
        $contract['provider_id'],
        "Você recebeu R$ " . number_format($netAmount, 2, ',', '.') . " pelo projeto '{$contract['project_title']}'",
        "/wallet"
    ]);

    $conn->commit();

    Helpers::jsonResponse([
        'message' => 'Conclusão aceita e pagamento liberado',
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
