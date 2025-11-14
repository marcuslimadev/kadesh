<?php
/**
 * AuctionController - Gerencia leilões ativos e ranking de propostas
 * 
 * Endpoints:
 * - GET /api/auctions/active - Lista leilões ativos
 * - GET /api/auctions/:id - Detalhes de um leilão específico
 * - GET /api/auctions/:id/ranking - Ranking de propostas
 */

require_once __DIR__ . '/../Backend/Database.php';
require_once __DIR__ . '/../Backend/Auth.php';

class AuctionController {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new Auth($this->db);
    }
    
    /**
     * Lista todos os leilões ativos
     * GET /api/auctions/active
     */
    public function getActiveAuctions() {
        try {
            // Parâmetros de filtro
            $category = $_GET['category'] ?? null;
            $maxPrice = $_GET['max_price'] ?? null;
            $location = $_GET['location'] ?? null;
            $radius = $_GET['radius'] ?? 50;
            $status = $_GET['status'] ?? 'open';
            
            $sql = "
                SELECT 
                    p.id,
                    p.title,
                    p.description,
                    p.category,
                    p.budget_min,
                    p.budget_max,
                    p.deadline,
                    p.location,
                    p.created_at,
                    p.auction_end_date,
                    u.name as owner_name,
                    u.avatar as owner_avatar,
                    COUNT(DISTINCT b.id) as bid_count,
                    MIN(b.bid_amount) as current_bid,
                    (SELECT AVG(rating) FROM reviews WHERE provider_id = p.user_id) as owner_rating
                FROM projects p
                INNER JOIN users u ON p.user_id = u.id
                LEFT JOIN bids b ON p.id = b.project_id AND b.status = 'active'
                WHERE p.status = 'open'
                AND p.auction_end_date > NOW()
            ";
            
            $params = [];
            
            // Filtro de categoria
            if ($category && $category !== 'all') {
                $sql .= " AND p.category = ?";
                $params[] = $category;
            }
            
            // Filtro de preço máximo
            if ($maxPrice) {
                $sql .= " AND p.budget_max <= ?";
                $params[] = $maxPrice;
            }
            
            // Filtro de localização (simplificado - ideal seria usar geolocalização)
            if ($location) {
                $sql .= " AND p.location LIKE ?";
                $params[] = "%{$location}%";
            }
            
            $sql .= " GROUP BY p.id, u.id ORDER BY p.created_at DESC";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $auctions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Adiciona informações calculadas
            foreach ($auctions as &$auction) {
                $auction['time_remaining'] = $this->calculateTimeRemaining($auction['auction_end_date']);
                $auction['urgency'] = $this->calculateUrgency($auction['auction_end_date']);
                $auction['owner_rating'] = $auction['owner_rating'] ? round($auction['owner_rating'], 1) : 0;
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $auctions,
                'count' => count($auctions)
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar leilões: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Obtém detalhes de um leilão específico
     * GET /api/auctions/:id
     */
    public function getAuctionDetails($id) {
        try {
            $sql = "
                SELECT 
                    p.*,
                    u.name as owner_name,
                    u.email as owner_email,
                    u.avatar as owner_avatar,
                    u.phone as owner_phone,
                    (SELECT AVG(rating) FROM reviews WHERE provider_id = p.user_id) as owner_rating,
                    (SELECT COUNT(*) FROM bids WHERE project_id = p.id AND status = 'active') as bid_count,
                    (SELECT MIN(bid_amount) FROM bids WHERE project_id = p.id AND status = 'active') as current_bid
                FROM projects p
                INNER JOIN users u ON p.user_id = u.id
                WHERE p.id = ?
            ";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
            $auction = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$auction) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Leilão não encontrado'
                ]);
                return;
            }
            
            // Adiciona informações calculadas
            $auction['time_remaining'] = $this->calculateTimeRemaining($auction['auction_end_date']);
            $auction['urgency'] = $this->calculateUrgency($auction['auction_end_date']);
            $auction['owner_rating'] = $auction['owner_rating'] ? round($auction['owner_rating'], 1) : 0;
            
            // Busca anexos do projeto
            $attachmentsSql = "SELECT * FROM project_attachments WHERE project_id = ?";
            $attachmentsStmt = $this->db->prepare($attachmentsSql);
            $attachmentsStmt->execute([$id]);
            $auction['attachments'] = $attachmentsStmt->fetchAll(PDO::FETCH_ASSOC);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $auction
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar detalhes: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Obtém ranking de propostas com score ponderado
     * GET /api/auctions/:id/ranking
     */
    public function getAuctionRanking($id) {
        try {
            // Busca projeto para obter pesos
            $projectSql = "SELECT price_weight, reputation_weight, budget_min, budget_max FROM projects WHERE id = ?";
            $projectStmt = $this->db->prepare($projectSql);
            $projectStmt->execute([$id]);
            $project = $projectStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$project) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Projeto não encontrado'
                ]);
                return;
            }
            
            // Pesos padrão (70% preço, 30% reputação)
            $priceWeight = $project['price_weight'] ?? 0.7;
            $reputationWeight = $project['reputation_weight'] ?? 0.3;
            $budgetMin = $project['budget_min'];
            $budgetMax = $project['budget_max'];
            
            // Busca todas as propostas ativas
            $sql = "
                SELECT 
                    b.id,
                    b.bid_amount,
                    b.availability_days,
                    b.message,
                    b.created_at,
                    u.id as provider_id,
                    u.name as provider_name,
                    u.avatar as provider_avatar,
                    u.company_name,
                    (SELECT AVG(rating) FROM reviews WHERE provider_id = u.id) as provider_rating,
                    (SELECT COUNT(*) FROM reviews WHERE provider_id = u.id) as review_count,
                    (SELECT COUNT(*) FROM projects WHERE user_id = u.id AND status = 'completed') as completed_projects
                FROM bids b
                INNER JOIN users u ON b.user_id = u.id
                WHERE b.project_id = ?
                AND b.status = 'active'
                ORDER BY b.created_at ASC
            ";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$id]);
            $bids = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Calcula score para cada proposta
            foreach ($bids as &$bid) {
                $priceIndex = $this->calculatePriceIndex($bid['bid_amount'], $budgetMin, $budgetMax);
                $reputationIndex = $this->calculateReputationIndex($bid['provider_rating'] ?? 0);
                
                $bid['price_index'] = round($priceIndex, 4);
                $bid['reputation_index'] = round($reputationIndex, 4);
                $bid['score'] = round(($priceWeight * $priceIndex + $reputationWeight * $reputationIndex) * 100, 2);
                $bid['provider_rating'] = $bid['provider_rating'] ? round($bid['provider_rating'], 1) : 0;
            }
            
            // Ordena por score (maior primeiro)
            usort($bids, function($a, $b) {
                return $b['score'] <=> $a['score'];
            });
            
            // Adiciona posição no ranking
            foreach ($bids as $index => &$bid) {
                $bid['rank'] = $index + 1;
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'bids' => $bids,
                    'weights' => [
                        'price' => $priceWeight,
                        'reputation' => $reputationWeight
                    ],
                    'budget' => [
                        'min' => $budgetMin,
                        'max' => $budgetMax
                    ]
                ],
                'count' => count($bids)
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar ranking: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Calcula índice de preço (0-1, menor é melhor)
     */
    private function calculatePriceIndex($price, $min, $max) {
        if ($max <= $min) return 0;
        
        // Normaliza: 1 para preço mínimo, 0 para preço máximo
        $normalized = 1 - (($price - $min) / ($max - $min));
        
        // Garante que está entre 0 e 1
        return max(0, min(1, $normalized));
    }
    
    /**
     * Calcula índice de reputação (0-1)
     */
    private function calculateReputationIndex($rating) {
        // Normaliza rating de 0-5 para 0-1
        return $rating / 5;
    }
    
    /**
     * Calcula tempo restante em segundos
     */
    private function calculateTimeRemaining($endDate) {
        $now = new DateTime();
        $end = new DateTime($endDate);
        $diff = $end->getTimestamp() - $now->getTimestamp();
        
        return max(0, $diff);
    }
    
    /**
     * Calcula nível de urgência
     */
    private function calculateUrgency($endDate) {
        $remaining = $this->calculateTimeRemaining($endDate);
        $hours = $remaining / 3600;
        
        if ($hours < 1) return 'critical';
        if ($hours < 24) return 'high';
        if ($hours < 72) return 'medium';
        return 'low';
    }
}

// Roteamento
$controller = new AuctionController();
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '/';

// Remove /api/auctions do path
$path = preg_replace('#^/api/auctions#', '', $path);

if ($method === 'GET') {
    if ($path === '/active') {
        $controller->getActiveAuctions();
    } elseif (preg_match('#^/(\d+)$#', $path, $matches)) {
        $controller->getAuctionDetails($matches[1]);
    } elseif (preg_match('#^/(\d+)/ranking$#', $path, $matches)) {
        $controller->getAuctionRanking($matches[1]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint não encontrado']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
