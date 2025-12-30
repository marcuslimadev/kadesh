<?php
/**
 * GET /admin/disputes
 * POST /admin/disputes/:id/resolve
 * Gerencia disputas
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = AuthMiddleware::authenticate();
AuthMiddleware::isAdmin($user);

$db = new Database();
$conn = $db->getConnection();

// GET - Lista disputas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $status = $_GET['status'] ?? 'disputed';
        $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
        $perPage = isset($_GET['per_page']) ? min(50, max(1, intval($_GET['per_page']))) : 20;
        $offset = ($page - 1) * $perPage;

        // Contar total
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM contracts WHERE status = ?");
        $stmt->execute([$status]);
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Buscar disputas
        $stmt = $conn->prepare("
            SELECT c.*, 
                   p.title as project_title, p.description as project_description,
                   client.name as client_name, client.email as client_email,
                   provider.name as provider_name, provider.email as provider_email
            FROM contracts c
            JOIN projects p ON c.project_id = p.id
            JOIN users client ON c.client_id = client.id
            JOIN users provider ON c.provider_id = provider.id
            WHERE c.status = ?
            ORDER BY c.updated_at DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$status, $perPage, $offset]);
        $disputes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        Helpers::jsonResponse([
            'disputes' => $disputes,
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

// POST - Resolver disputa (rota: /admin/disputes/:id/resolve)
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $contractId = $_GET['id'] ?? null;
    
    if (!$contractId) {
        Helpers::jsonResponse(['error' => 'ID do contrato é obrigatório'], 400);
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $resolution = $data['resolution'] ?? null; // 'refund_client', 'pay_provider', 'split'
    $notes = $data['notes'] ?? '';

    if (!$resolution) {
        Helpers::jsonResponse(['error' => 'Resolução é obrigatória'], 400);
    }

    try {
        $conn->beginTransaction();

        // Buscar contrato
        $stmt = $conn->prepare("SELECT * FROM contracts WHERE id = ? AND status = 'disputed'");
        $stmt->execute([$contractId]);
        $contract = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$contract) {
            Helpers::jsonResponse(['error' => 'Disputa não encontrada'], 404);
        }

        $amount = floatval($contract['amount']);

        if ($resolution === 'refund_client') {
            // Devolver ao cliente - apenas atualizar status
            $stmt = $conn->prepare("
                UPDATE contracts 
                SET status = 'cancelled', 
                    terms = CONCAT(COALESCE(terms, ''), '\n\n--- RESOLUÇÃO ADMIN ---\nDecisão: Reembolso ao cliente\nNotas: ', ?)
                WHERE id = ?
            ");
            $stmt->execute([$notes, $contractId]);

            // Notificar ambas as partes
            $this->notifyParties($conn, $contract, 'Disputa resolvida: Reembolso ao cliente', $notes);

        } elseif ($resolution === 'pay_provider') {
            // Pagar ao prestador
            $platformFeePercent = floatval(getenv('PLATFORM_FEE_PERCENT') ?: 10);
            $platformFee = $amount * ($platformFeePercent / 100);
            $netAmount = $amount - $platformFee;

            // Buscar saldo atual
            $stmt = $conn->prepare("
                SELECT COALESCE(balance_after, 0) as balance 
                FROM wallet_transactions 
                WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT 1
            ");
            $stmt->execute([$contract['provider_id']]);
            $wallet = $stmt->fetch(PDO::FETCH_ASSOC);
            $newBalance = ($wallet ? floatval($wallet['balance']) : 0) + $netAmount;

            // Criar transação
            $transactionId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );

            $stmt = $conn->prepare("
                INSERT INTO wallet_transactions (id, user_id, type, amount, balance_after, description, reference_type, reference_id)
                VALUES (?, ?, 'dispute_resolution', ?, ?, 'Pagamento após resolução de disputa', 'contract', ?)
            ");
            $stmt->execute([$transactionId, $contract['provider_id'], $netAmount, $newBalance, $contractId]);

            $stmt = $conn->prepare("
                UPDATE contracts 
                SET status = 'completed', 
                    terms = CONCAT(COALESCE(terms, ''), '\n\n--- RESOLUÇÃO ADMIN ---\nDecisão: Pagamento ao prestador\nNotas: ', ?)
                WHERE id = ?
            ");
            $stmt->execute([$notes, $contractId]);

        } elseif ($resolution === 'split') {
            // Dividir 50/50
            $splitAmount = $amount * 0.5;
            $platformFee = $splitAmount * 0.1;
            $netAmount = $splitAmount - $platformFee;

            // Pagar metade ao provider
            $stmt = $conn->prepare("
                SELECT COALESCE(balance_after, 0) as balance 
                FROM wallet_transactions 
                WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT 1
            ");
            $stmt->execute([$contract['provider_id']]);
            $wallet = $stmt->fetch(PDO::FETCH_ASSOC);
            $newBalance = ($wallet ? floatval($wallet['balance']) : 0) + $netAmount;

            $transactionId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );

            $stmt = $conn->prepare("
                INSERT INTO wallet_transactions (id, user_id, type, amount, balance_after, description, reference_type, reference_id)
                VALUES (?, ?, 'dispute_resolution', ?, ?, 'Pagamento parcial após disputa (50%)', 'contract', ?)
            ");
            $stmt->execute([$transactionId, $contract['provider_id'], $netAmount, $newBalance, $contractId]);

            $stmt = $conn->prepare("
                UPDATE contracts 
                SET status = 'completed', 
                    terms = CONCAT(COALESCE(terms, ''), '\n\n--- RESOLUÇÃO ADMIN ---\nDecisão: Divisão 50/50\nNotas: ', ?)
                WHERE id = ?
            ");
            $stmt->execute([$notes, $contractId]);
        }

        // Atualizar projeto
        $stmt = $conn->prepare("UPDATE projects SET status = 'completed' WHERE id = ?");
        $stmt->execute([$contract['project_id']]);

        $conn->commit();

        Helpers::jsonResponse(['message' => 'Disputa resolvida com sucesso']);

    } catch (PDOException $e) {
        $conn->rollBack();
        Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
    }

} else {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

// Função auxiliar para notificar partes
function notifyParties($conn, $contract, $title, $notes) {
    foreach ([$contract['client_id'], $contract['provider_id']] as $userId) {
        $notifId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
        
        $stmt = $conn->prepare("
            INSERT INTO notifications (id, user_id, type, title, content, action_url)
            VALUES (?, ?, 'system', ?, ?, ?)
        ");
        $stmt->execute([$notifId, $userId, $title, $notes, '/contracts/' . $contract['id']]);
    }
}
