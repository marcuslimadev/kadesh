<?php
namespace App\Backend\Controllers;

class EscrowController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Criar conta de escrow ao aceitar proposta
     */
    public function createEscrowAccount() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $projectId = $data['project_id'] ?? 0;
        
        // Verificar se projeto pertence ao usuário
        $stmt = $this->db->prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?");
        $stmt->execute([$projectId, $userId]);
        $project = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado']);
            return;
        }
        
        // Buscar lance vencedor
        $stmt = $this->db->prepare("SELECT * FROM bids WHERE id = ? AND is_winner = 1", [$project['winning_bid_id']]);
        $stmt->execute([$project['winning_bid_id']]);
        $winningBid = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$winningBid) {
            http_response_code(404);
            echo json_encode(['error' => 'Lance vencedor não encontrado']);
            return;
        }
        
        $totalAmount = $winningBid['amount'];
        $platformFee = $totalAmount * 0.10; // 10% de taxa
        
        // Verificar saldo
        $stmt = $this->db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($user['wallet_balance'] < $totalAmount) {
            http_response_code(422);
            echo json_encode(['error' => 'Saldo insuficiente']);
            return;
        }
        
        // Congelar fundos na carteira
        $newBalance = $user['wallet_balance'] - $totalAmount;
        $stmt = $this->db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?");
        $stmt->execute([$newBalance, $userId]);
        
        // Registrar transação de hold
        $hash = hash('sha256', $userId . $totalAmount . time());
        $stmt = $this->db->prepare("
            INSERT INTO wallet_transactions 
            (user_id, transaction_type, amount, balance_before, balance_after, reference_type, reference_id, status, hash, completed_at)
            VALUES (?, 'escrow_hold', ?, ?, ?, 'project', ?, 'completed', ?, NOW())
        ");
        $stmt->execute([$userId, $totalAmount, $user['wallet_balance'], $newBalance, $projectId, $hash]);
        
        // Criar conta de escrow
        $stmt = $this->db->prepare("
            INSERT INTO escrow_accounts 
            (project_id, contractor_id, provider_id, total_amount, held_amount, platform_fee_percentage, platform_fee_amount, status)
            VALUES (?, ?, ?, ?, ?, 10.0, ?, 'active')
        ");
        $stmt->execute([
            $projectId,
            $userId,
            $winningBid['provider_id'],
            $totalAmount,
            $totalAmount,
            $platformFee
        ]);
        
        $escrowId = $this->db->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'escrow_id' => $escrowId,
            'total_amount' => $totalAmount,
            'platform_fee' => $platformFee,
            'message' => 'Fundos congelados em escrow'
        ]);
    }
    
    /**
     * Liberar pagamento de um marco
     */
    public function releaseMilestone() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $milestoneId = $data['milestone_id'] ?? 0;
        
        // Buscar marco
        $stmt = $this->db->prepare("
            SELECT pm.*, ea.* 
            FROM project_milestones pm
            JOIN escrow_accounts ea ON pm.escrow_id = ea.id
            WHERE pm.id = ? AND ea.contractor_id = ?
        ");
        $stmt->execute([$milestoneId, $userId]);
        $milestone = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$milestone) {
            http_response_code(404);
            echo json_encode(['error' => 'Marco não encontrado']);
            return;
        }
        
        if ($milestone['status'] !== 'submitted') {
            http_response_code(422);
            echo json_encode(['error' => 'Marco não está pronto para aprovação']);
            return;
        }
        
        $amount = $milestone['amount'];
        $providerId = $milestone['provider_id'];
        
        // Atualizar marco
        $stmt = $this->db->prepare("UPDATE project_milestones SET status = 'released', released_at = NOW() WHERE id = ?");
        $stmt->execute([$milestoneId]);
        
        // Atualizar escrow
        $stmt = $this->db->prepare("
            UPDATE escrow_accounts 
            SET released_amount = released_amount + ?, held_amount = held_amount - ?
            WHERE id = ?
        ");
        $stmt->execute([$amount, $amount, $milestone['escrow_id']]);
        
        // Transferir para fornecedor
        $stmt = $this->db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
        $stmt->execute([$providerId]);
        $provider = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        $newBalance = $provider['wallet_balance'] + $amount;
        $stmt = $this->db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?");
        $stmt->execute([$newBalance, $providerId]);
        
        // Registrar transação
        $hash = hash('sha256', $providerId . $amount . time());
        $stmt = $this->db->prepare("
            INSERT INTO wallet_transactions 
            (user_id, transaction_type, amount, balance_before, balance_after, reference_type, reference_id, status, hash, completed_at)
            VALUES (?, 'payment_received', ?, ?, ?, 'milestone', ?, 'completed', ?, NOW())
        ");
        $stmt->execute([$providerId, $amount, $provider['wallet_balance'], $newBalance, $milestoneId, $hash]);
        
        echo json_encode([
            'success' => true,
            'amount_released' => $amount,
            'message' => 'Pagamento liberado com sucesso'
        ]);
    }
}
