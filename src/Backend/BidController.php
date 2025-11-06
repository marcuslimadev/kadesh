<?php
/**
 * BidController - Gerencia propostas em leilões
 * 
 * Endpoints:
 * - GET /api/bids/my - Minhas propostas
 * - POST /api/bids - Criar nova proposta
 * - GET /api/projects/:id/bids - Propostas de um projeto
 * - POST /api/projects/:id/accept-bid - Aceitar proposta vencedora
 */

require_once __DIR__ . '/../Backend/Database.php';
require_once __DIR__ . '/../Backend/Auth.php';

class BidController {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new Auth($this->db);
    }
    
    /**
     * Lista minhas propostas
     * GET /api/bids/my
     */
    public function getMyBids() {
        try {
            $user = $this->auth->getCurrentUser();
            
            if (!$user) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Não autenticado']);
                return;
            }
            
            $sql = "
                SELECT 
                    b.id,
                    b.project_id,
                    b.bid_amount,
                    b.availability_days,
                    b.message,
                    b.status,
                    b.created_at,
                    p.title as project_title,
                    p.category as project_category,
                    p.status as project_status,
                    p.auction_end_date,
                    (SELECT COUNT(*) FROM bids WHERE project_id = p.id AND status = 'active') as total_bids,
                    (SELECT MIN(bid_amount) FROM bids WHERE project_id = p.id AND status = 'active') as lowest_bid
                FROM bids b
                INNER JOIN projects p ON b.project_id = p.id
                WHERE b.user_id = ?
                ORDER BY b.created_at DESC
            ";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$user['id']]);
            $bids = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Adiciona informações calculadas
            foreach ($bids as &$bid) {
                $bid['is_winning'] = ($bid['bid_amount'] == $bid['lowest_bid']);
                $bid['time_remaining'] = $this->calculateTimeRemaining($bid['auction_end_date']);
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $bids,
                'count' => count($bids)
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar propostas: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Cria nova proposta
     * POST /api/bids
     */
    public function createBid() {
        try {
            $user = $this->auth->getCurrentUser();
            
            if (!$user) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Não autenticado']);
                return;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validações
            $required = ['project_id', 'bid_amount', 'availability_days'];
            foreach ($required as $field) {
                if (!isset($data[$field])) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => "Campo {$field} é obrigatório"]);
                    return;
                }
            }
            
            $projectId = $data['project_id'];
            $bidAmount = floatval($data['bid_amount']);
            $availabilityDays = intval($data['availability_days']);
            $message = $data['message'] ?? '';
            
            // Verifica se projeto existe e está aberto
            $projectSql = "SELECT id, user_id, budget_min, budget_max, status, auction_end_date FROM projects WHERE id = ?";
            $projectStmt = $this->db->prepare($projectSql);
            $projectStmt->execute([$projectId]);
            $project = $projectStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$project) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Projeto não encontrado']);
                return;
            }
            
            if ($project['status'] !== 'open') {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Projeto não está aceitando propostas']);
                return;
            }
            
            if ($project['user_id'] == $user['id']) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Você não pode dar lance no seu próprio projeto']);
                return;
            }
            
            // Verifica se leilão ainda está ativo
            $now = new DateTime();
            $endDate = new DateTime($project['auction_end_date']);
            if ($now > $endDate) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Leilão já encerrado']);
                return;
            }
            
            // Validação de valor
            if ($bidAmount < $project['budget_min'] || $bidAmount > $project['budget_max']) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => "Valor deve estar entre R$ {$project['budget_min']} e R$ {$project['budget_max']}"
                ]);
                return;
            }
            
            // Verifica se já tem proposta ativa
            $existingSql = "SELECT id FROM bids WHERE project_id = ? AND user_id = ? AND status = 'active'";
            $existingStmt = $this->db->prepare($existingSql);
            $existingStmt->execute([$projectId, $user['id']]);
            $existing = $existingStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existing) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Você já tem uma proposta ativa neste projeto']);
                return;
            }
            
            // Anti-spam: limita 1 lance a cada 5 minutos
            $recentSql = "SELECT created_at FROM bids WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            $recentStmt = $this->db->prepare($recentSql);
            $recentStmt->execute([$user['id']]);
            $recent = $recentStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($recent) {
                $lastBid = new DateTime($recent['created_at']);
                $diff = $now->getTimestamp() - $lastBid->getTimestamp();
                
                if ($diff < 300) { // 5 minutos
                    $wait = 300 - $diff;
                    http_response_code(429);
                    echo json_encode([
                        'success' => false,
                        'message' => "Aguarde {$wait} segundos antes de fazer outra proposta"
                    ]);
                    return;
                }
            }
            
            // Cria proposta
            $insertSql = "
                INSERT INTO bids (project_id, user_id, bid_amount, availability_days, message, status, created_at)
                VALUES (?, ?, ?, ?, ?, 'active', NOW())
            ";
            
            $insertStmt = $this->db->prepare($insertSql);
            $insertStmt->execute([
                $projectId,
                $user['id'],
                $bidAmount,
                $availabilityDays,
                $message
            ]);
            
            $bidId = $this->db->lastInsertId();
            
            // TODO: Criar notificação para o dono do projeto
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Proposta enviada com sucesso',
                'data' => [
                    'id' => $bidId,
                    'project_id' => $projectId,
                    'bid_amount' => $bidAmount,
                    'availability_days' => $availabilityDays
                ]
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao criar proposta: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Lista propostas de um projeto
     * GET /api/projects/:id/bids
     */
    public function getProjectBids($projectId) {
        try {
            $user = $this->auth->getCurrentUser();
            
            if (!$user) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Não autenticado']);
                return;
            }
            
            // Verifica se usuário é dono do projeto
            $projectSql = "SELECT user_id FROM projects WHERE id = ?";
            $projectStmt = $this->db->prepare($projectSql);
            $projectStmt->execute([$projectId]);
            $project = $projectStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$project) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Projeto não encontrado']);
                return;
            }
            
            if ($project['user_id'] != $user['id']) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Acesso negado']);
                return;
            }
            
            // Busca propostas
            $sql = "
                SELECT 
                    b.id,
                    b.bid_amount,
                    b.availability_days,
                    b.message,
                    b.status,
                    b.created_at,
                    u.id as provider_id,
                    u.name as provider_name,
                    u.avatar as provider_avatar,
                    u.company_name,
                    (SELECT AVG(rating) FROM reviews WHERE provider_id = u.id) as provider_rating,
                    (SELECT COUNT(*) FROM reviews WHERE provider_id = u.id) as review_count
                FROM bids b
                INNER JOIN users u ON b.user_id = u.id
                WHERE b.project_id = ?
                ORDER BY b.created_at ASC
            ";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([$projectId]);
            $bids = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($bids as &$bid) {
                $bid['provider_rating'] = $bid['provider_rating'] ? round($bid['provider_rating'], 1) : 0;
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $bids,
                'count' => count($bids)
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao buscar propostas: ' . $e->getMessage()
            ]);
        }
    }
    
    /**
     * Aceita proposta vencedora
     * POST /api/projects/:id/accept-bid
     */
    public function acceptBid($projectId) {
        try {
            $user = $this->auth->getCurrentUser();
            
            if (!$user) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Não autenticado']);
                return;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            $bidId = $data['bid_id'] ?? null;
            
            if (!$bidId) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'bid_id é obrigatório']);
                return;
            }
            
            // Verifica se usuário é dono do projeto
            $projectSql = "SELECT user_id, status FROM projects WHERE id = ?";
            $projectStmt = $this->db->prepare($projectSql);
            $projectStmt->execute([$projectId]);
            $project = $projectStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$project) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Projeto não encontrado']);
                return;
            }
            
            if ($project['user_id'] != $user['id']) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Acesso negado']);
                return;
            }
            
            if ($project['status'] !== 'open') {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Projeto já foi encerrado']);
                return;
            }
            
            // Verifica se bid existe e pertence ao projeto
            $bidSql = "SELECT id, user_id, bid_amount FROM bids WHERE id = ? AND project_id = ? AND status = 'active'";
            $bidStmt = $this->db->prepare($bidSql);
            $bidStmt->execute([$bidId, $projectId]);
            $bid = $bidStmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$bid) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Proposta não encontrada']);
                return;
            }
            
            // Inicia transação
            $this->db->beginTransaction();
            
            try {
                // Atualiza proposta para aceita
                $updateBidSql = "UPDATE bids SET status = 'accepted' WHERE id = ?";
                $updateBidStmt = $this->db->prepare($updateBidSql);
                $updateBidStmt->execute([$bidId]);
                
                // Rejeita outras propostas
                $rejectSql = "UPDATE bids SET status = 'rejected' WHERE project_id = ? AND id != ?";
                $rejectStmt = $this->db->prepare($rejectSql);
                $rejectStmt->execute([$projectId, $bidId]);
                
                // Atualiza projeto
                $updateProjectSql = "
                    UPDATE projects 
                    SET status = 'in_progress', 
                        accepted_bid_id = ?,
                        contractor_id = ?,
                        final_price = ?
                    WHERE id = ?
                ";
                $updateProjectStmt = $this->db->prepare($updateProjectSql);
                $updateProjectStmt->execute([
                    $bidId,
                    $bid['user_id'],
                    $bid['bid_amount'],
                    $projectId
                ]);
                
                // TODO: Criar notificação para o vencedor
                // TODO: Criar escrow para pagamento
                
                $this->db->commit();
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Proposta aceita com sucesso',
                    'data' => [
                        'project_id' => $projectId,
                        'bid_id' => $bidId,
                        'contractor_id' => $bid['user_id'],
                        'final_price' => $bid['bid_amount']
                    ]
                ]);
                
            } catch (Exception $e) {
                $this->db->rollBack();
                throw $e;
            }
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erro ao aceitar proposta: ' . $e->getMessage()
            ]);
        }
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
}

// Roteamento
$controller = new BidController();
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['PATH_INFO'] ?? '/';

if ($method === 'GET') {
    if ($path === '/api/bids/my') {
        $controller->getMyBids();
    } elseif (preg_match('#^/api/projects/(\d+)/bids$#', $path, $matches)) {
        $controller->getProjectBids($matches[1]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint não encontrado']);
    }
} elseif ($method === 'POST') {
    if ($path === '/api/bids') {
        $controller->createBid();
    } elseif (preg_match('#^/api/projects/(\d+)/accept-bid$#', $path, $matches)) {
        $controller->acceptBid($matches[1]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint não encontrado']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
