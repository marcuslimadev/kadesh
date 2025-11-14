<?php
namespace App\Backend\Controllers;

class ReviewController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Criar avaliação
     */
    public function createReview() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $projectId = $data['project_id'] ?? 0;
        $rating = $data['rating'] ?? 0;
        $comment = $data['comment'] ?? '';
        
        // Verificar se projeto está completo
        $stmt = $this->db->prepare("
            SELECT * FROM projects 
            WHERE id = ? AND status = 'completed' 
              AND (user_id = ? OR assigned_to = ?)
        ");
        $stmt->execute([$projectId, $userId, $userId]);
        $project = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado ou não finalizado']);
            return;
        }
        
        // Definir quem avalia quem
        $reviewerId = $userId;
        $reviewedId = ($project['user_id'] == $userId) ? $project['assigned_to'] : $project['user_id'];
        
        // Inserir avaliação
        $stmt = $this->db->prepare("
            INSERT INTO reviews 
            (project_id, reviewer_id, reviewed_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$projectId, $reviewerId, $reviewedId, $rating, $comment]);
        
        // Recalcular média do avaliado
        $stmt = $this->db->prepare("
            SELECT AVG(rating) as avg_rating, COUNT(*) as total 
            FROM reviews 
            WHERE reviewed_id = ?
        ");
        $stmt->execute([$reviewedId]);
        $stats = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        $stmt = $this->db->prepare("
            UPDATE users 
            SET rating = ?, total_reviews = ? 
            WHERE id = ?
        ");
        $stmt->execute([$stats['avg_rating'], $stats['total'], $reviewedId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Avaliação enviada com sucesso'
        ]);
    }
    
    /**
     * Listar avaliações de um usuário
     */
    public function getUserReviews() {
        $targetUserId = $_GET['user_id'] ?? 0;
        
        $stmt = $this->db->prepare("
            SELECT r.*, 
                   u.name as reviewer_name, 
                   p.title as project_title
            FROM reviews r
            JOIN users u ON r.reviewer_id = u.id
            JOIN projects p ON r.project_id = p.id
            WHERE r.reviewed_id = ?
            ORDER BY r.created_at DESC
            LIMIT 20
        ");
        $stmt->execute([$targetUserId]);
        $reviews = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['reviews' => $reviews]);
    }
}
