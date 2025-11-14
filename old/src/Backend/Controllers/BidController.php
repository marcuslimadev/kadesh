<?php
namespace App\Backend\Controllers;

class BidController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Dar um lance
     */
    public function placeBid() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $projectId = $data['project_id'] ?? 0;
        $amount = $data['amount'] ?? 0;
        $proposal = $data['proposal'] ?? '';
        $deliveryDays = $data['delivery_time_days'] ?? 30;
        
        // Validações básicas
        if ($amount <= 0) {
            http_response_code(422);
            echo json_encode(['error' => 'Valor inválido']);
            return;
        }
        
        if (empty($proposal)) {
            http_response_code(422);
            echo json_encode(['error' => 'Proposta não pode ser vazia']);
            return;
        }
        
        // Verificar se projeto existe e está aberto
        $stmt = $this->db->prepare("SELECT * FROM projects WHERE id = ? AND status = 'open'");
        $stmt->execute([$projectId]);
        $project = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado ou não está aceitando propostas']);
            return;
        }
        
        // Verificar se usuário já tem lance ativo neste projeto
        $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM bids WHERE project_id = ? AND provider_id = ? AND status = 'pending'");
        $stmt->execute([$projectId, $userId]);
        $existing = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($existing['total'] > 0) {
            http_response_code(422);
            echo json_encode(['error' => 'Você já tem uma proposta ativa neste projeto']);
            return;
        }
        
        // Inserir lance
        $stmt = $this->db->prepare("
            INSERT INTO bids (project_id, provider_id, amount, proposal, delivery_time_days, status, submitted_at)
            VALUES (?, ?, ?, ?, ?, 'pending', NOW())
        ");
        
        $stmt->execute([
            $projectId,
            $userId,
            $amount,
            $proposal,
            $deliveryDays
        ]);
        
        $bidId = $this->db->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'bid_id' => $bidId,
            'message' => 'Proposta enviada com sucesso!'
        ]);
    }
    
    /**
     * Meus lances
     */
    public function getMyBids() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT 
                b.*,
                p.title as project_title,
                p.description as project_description,
                p.status as project_status,
                p.bidding_ends_at,
                u.name as client_name
            FROM bids b
            JOIN projects p ON b.project_id = p.id
            JOIN users u ON p.contractor_id = u.id
            WHERE b.provider_id = ?
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([$userId]);
        $bids = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['bids' => $bids]);
    }
}
