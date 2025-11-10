<?php
namespace App\Backend\Controllers;

class AuctionController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Criar leilão para um projeto
     */
    public function createAuction() {
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
        
        $durationMinutes = $data['duration_minutes'] ?? 10080; // 7 dias padrão
        $endsAt = date('Y-m-d H:i:s', time() + ($durationMinutes * 60));
        
        $stmt = $this->db->prepare("
            INSERT INTO project_auction_config 
            (project_id, min_budget, max_budget, min_bid_decrement, auction_duration_minutes, 
             soft_close_minutes, price_weight, reputation_weight, started_at, ends_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, 'open')
        ");
        
        $stmt->execute([
            $projectId,
            $data['min_budget'] ?? 0,
            $data['max_budget'] ?? $project['max_budget'],
            $data['min_bid_decrement'] ?? 50,
            $durationMinutes,
            $data['soft_close_minutes'] ?? 2,
            $data['price_weight'] ?? 0.70,
            $data['reputation_weight'] ?? 0.30,
            $endsAt
        ]);
        
        $auctionId = $this->db->lastInsertId();
        
        // Atualizar projeto para status "open"
        $stmt = $this->db->prepare("UPDATE projects SET status = 'open' WHERE id = ?");
        $stmt->execute([$projectId]);
        
        echo json_encode([
            'success' => true,
            'auction_id' => $auctionId,
            'ends_at' => $endsAt,
            'message' => 'Leilão iniciado com sucesso'
        ]);
    }
    
    /**
     * Listar leilões ativos
     */
    public function getActiveAuctions() {
        $stmt = $this->db->query("
            SELECT 
                pac.*,
                p.title,
                p.description,
                p.user_id as contractor_id,
                u.name as contractor_name,
                (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bid_count,
                (SELECT MIN(amount) FROM bids WHERE project_id = p.id AND is_withdrawn = 0) as current_lowest_bid
            FROM project_auction_config pac
            JOIN projects p ON pac.project_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE pac.status = 'open' AND pac.ends_at > NOW()
            ORDER BY pac.ends_at ASC
        ");
        
        $auctions = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['auctions' => $auctions]);
    }
    
    /**
     * Detalhes do leilão + placar
     */
    public function getAuctionDetail($auctionId) {
        // Buscar leilão
        $stmt = $this->db->prepare("
            SELECT 
                pac.*,
                p.title,
                p.description,
                p.user_id as contractor_id,
                u.name as contractor_name
            FROM project_auction_config pac
            JOIN projects p ON pac.project_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE pac.id = ?
        ");
        $stmt->execute([$auctionId]);
        $auction = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$auction) {
            http_response_code(404);
            echo json_encode(['error' => 'Leilão não encontrado']);
            return;
        }
        
        // Buscar lances
        $stmt = $this->db->prepare("
            SELECT 
                b.*,
                u.name as provider_name,
                u.rating as provider_rating
            FROM bids b
            JOIN users u ON b.provider_id = u.id
            WHERE b.project_id = ? AND b.is_withdrawn = 0
            ORDER BY b.calculated_score DESC, b.amount ASC
        ");
        $stmt->execute([$auction['project_id']]);
        $bids = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode([
            'auction' => $auction,
            'bids' => $bids
        ]);
    }
    
    /**
     * Encerrar leilão e selecionar vencedor
     */
    public function endAuction($auctionId) {
        $stmt = $this->db->prepare("SELECT * FROM project_auction_config WHERE id = ?");
        $stmt->execute([$auctionId]);
        $auction = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$auction) {
            http_response_code(404);
            echo json_encode(['error' => 'Leilão não encontrado']);
            return;
        }
        
        // Buscar lance vencedor (melhor score)
        $stmt = $this->db->prepare("
            SELECT * FROM bids 
            WHERE project_id = ? AND is_withdrawn = 0
            ORDER BY calculated_score DESC, amount ASC
            LIMIT 1
        ");
        $stmt->execute([$auction['project_id']]);
        $winningBid = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($winningBid) {
            // Marcar vencedor
            $stmt = $this->db->prepare("UPDATE bids SET is_winner = 1 WHERE id = ?");
            $stmt->execute([$winningBid['id']]);
            
            // Atualizar leilão
            $stmt = $this->db->prepare("
                UPDATE project_auction_config 
                SET status = 'closed', winner_bid_id = ?, actual_end_time = NOW()
                WHERE id = ?
            ");
            $stmt->execute([$winningBid['id'], $auctionId]);
            
            // Atualizar projeto
            $stmt = $this->db->prepare("
                UPDATE projects 
                SET status = 'in_progress', winning_bid_id = ?, awarded_to = ?
                WHERE id = ?
            ");
            $stmt->execute([$winningBid['id'], $winningBid['provider_id'], $auction['project_id']]);
            
            echo json_encode([
                'success' => true,
                'winner' => [
                    'bid_id' => $winningBid['id'],
                    'provider_id' => $winningBid['provider_id'],
                    'amount' => $winningBid['amount']
                ]
            ]);
        } else {
            // Sem lances
            $stmt = $this->db->prepare("UPDATE project_auction_config SET status = 'cancelled' WHERE id = ?");
            $stmt->execute([$auctionId]);
            
            echo json_encode(['success' => false, 'message' => 'Leilão encerrado sem lances']);
        }
    }
}
