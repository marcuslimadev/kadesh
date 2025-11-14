<?php
namespace App\Backend\Controllers;

class TimelineController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Obter timeline de um projeto
     */
    public function getProjectTimeline() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $projectId = $_GET['project_id'] ?? 0;
        
        // Verificar acesso
        $stmt = $this->db->prepare("
            SELECT * FROM projects 
            WHERE id = ? AND (user_id = ? OR assigned_to = ?)
        ");
        $stmt->execute([$projectId, $userId, $userId]);
        $project = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado']);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT * FROM project_timeline_events 
            WHERE project_id = ? 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$projectId]);
        $events = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['timeline' => $events]);
    }
    
    /**
     * Adicionar evento (uso interno)
     */
    public function addEvent($projectId, $eventType, $title, $description, $userId = null) {
        $stmt = $this->db->prepare("
            INSERT INTO project_timeline_events 
            (project_id, event_type, title, description, triggered_by)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$projectId, $eventType, $title, $description, $userId]);
        
        return $this->db->lastInsertId();
    }
}
