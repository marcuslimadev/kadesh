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
        
        // Buscar leilão
        $stmt = $this->db->prepare("SELECT * FROM project_auction_config WHERE project_id = ? AND status = 'open'");
        $stmt->execute([$projectId]);
        $auction = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$auction) {
            http_response_code(404);
            echo json_encode(['error' => 'Leilão não encontrado ou encerrado']);
            return;
        }
        
        // Verificar se leilão já encerrou
        if (strtotime($auction['ends_at']) < time()) {
            http_response_code(422);
            echo json_encode(['error' => 'Leilão já encerrou']);
            return;
        }
        
        // Verificar valor mínimo
        if ($amount < $auction['min_budget']) {
            http_response_code(422);
            echo json_encode(['error' => 'Valor abaixo do mínimo permitido']);
            return;
        }
        
        // Verificar decremento mínimo
        $stmt = $this->db->prepare("SELECT MIN(amount) as lowest FROM bids WHERE project_id = ? AND is_withdrawn = 0");
        $stmt->execute([$projectId]);
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($result['lowest'] !== null) {
            $minAllowed = $result['lowest'] - $auction['min_bid_decrement'];
            if ($amount > $result['lowest']) {
                http_response_code(422);
                echo json_encode([
                    'error' => 'Seu lance deve ser menor que o atual',
                    'current_lowest' => $result['lowest']
                ]);
                return;
            }
        }
        
        // Buscar reputação do usuário
        $stmt = $this->db->prepare("SELECT rating FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        $reputationScore = $user['rating'] ?? 0;
        
        // Calcular score (70% preço + 30% reputação)
        $priceScore = 100 - (($amount - $auction['min_budget']) / ($auction['max_budget'] - $auction['min_budget']) * 100);
        $finalScore = ($auction['price_weight'] * $priceScore) + ($auction['reputation_weight'] * ($reputationScore * 20)); // rating 0-5 -> 0-100
        
        // Inserir lance
        $stmt = $this->db->prepare("
            INSERT INTO bids (project_id, provider_id, amount, proposal_text, reputation_score, calculated_score)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $projectId,
            $userId,
            $amount,
            $proposal,
            $reputationScore,
            $finalScore
        ]);
        
        $bidId = $this->db->lastInsertId();
        
        // Atualizar rankings
        $this->updateRankings($projectId);
        
        // Verificar soft close
        $this->checkSoftClose($auction['id']);
        
        echo json_encode([
            'success' => true,
            'bid_id' => $bidId,
            'calculated_score' => $finalScore,
            'message' => 'Lance enviado com sucesso'
        ]);
    }
    
    /**
     * Atualizar rankings dos lances
     */
    private function updateRankings($projectId) {
        $stmt = $this->db->prepare("
            SELECT id FROM bids 
            WHERE project_id = ? AND is_withdrawn = 0
            ORDER BY calculated_score DESC, amount ASC
        ");
        $stmt->execute([$projectId]);
        $bids = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        $rank = 1;
        $updateStmt = $this->db->prepare("UPDATE bids SET rank_position = ? WHERE id = ?");
        
        foreach ($bids as $bid) {
            $updateStmt->execute([$rank, $bid['id']]);
            $rank++;
        }
    }
    
    /**
     * Verificar e aplicar soft close
     */
    private function checkSoftClose($auctionId) {
        $stmt = $this->db->prepare("SELECT * FROM project_auction_config WHERE id = ?");
        $stmt->execute([$auctionId]);
        $auction = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$auction) return;
        
        $endsAt = strtotime($auction['ends_at']);
        $now = time();
        $secondsRemaining = $endsAt - $now;
        $softCloseSeconds = $auction['soft_close_minutes'] * 60;
        
        // Se houver lance nos últimos X minutos, estender
        if ($secondsRemaining > 0 && $secondsRemaining < $softCloseSeconds) {
            $newEndsAt = date('Y-m-d H:i:s', $now + $softCloseSeconds);
            
            $stmt = $this->db->prepare("UPDATE project_auction_config SET ends_at = ?, status = 'extended' WHERE id = ?");
            $stmt->execute([$newEndsAt, $auctionId]);
        }
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
                p.status as project_status,
                pac.status as auction_status,
                pac.ends_at
            FROM bids b
            JOIN projects p ON b.project_id = p.id
            LEFT JOIN project_auction_config pac ON p.id = pac.project_id
            WHERE b.provider_id = ?
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([$userId]);
        $bids = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['bids' => $bids]);
    }
}
