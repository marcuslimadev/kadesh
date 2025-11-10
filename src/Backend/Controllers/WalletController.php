<?php
namespace App\Backend\Controllers;

class WalletController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Obter saldo
     */
    public function getBalance() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $stmt = $this->db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        echo json_encode(['balance' => $user['wallet_balance'] ?? 0]);
    }
    
    /**
     * Depositar (mock - simula PIX)
     */
    public function deposit() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $amount = $data['amount'] ?? 0;
        
        if ($amount <= 0) {
            http_response_code(422);
            echo json_encode(['error' => 'Valor inválido']);
            return;
        }
        
        // Buscar saldo atual
        $stmt = $this->db->prepare("SELECT wallet_balance FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        $balanceBefore = $user['wallet_balance'];
        $balanceAfter = $balanceBefore + $amount;
        
        // Atualizar saldo
        $stmt = $this->db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?");
        $stmt->execute([$balanceAfter, $userId]);
        
        // Registrar transação
        $hash = hash('sha256', $userId . $amount . time());
        $stmt = $this->db->prepare("
            INSERT INTO wallet_transactions 
            (user_id, transaction_type, amount, balance_before, balance_after, status, hash, completed_at)
            VALUES (?, 'deposit', ?, ?, ?, 'completed', ?, NOW())
        ");
        $stmt->execute([$userId, $amount, $balanceBefore, $balanceAfter, $hash]);
        
        echo json_encode([
            'success' => true,
            'new_balance' => $balanceAfter,
            'message' => 'Depósito realizado com sucesso'
        ]);
    }
    
    /**
     * Extrato
     */
    public function getStatement() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT * FROM wallet_transactions 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        ");
        $stmt->execute([$userId]);
        $transactions = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['transactions' => $transactions]);
    }
}
