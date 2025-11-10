<?php
namespace App\Backend\Controllers;

class NotificationController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Listar notificações do usuário
     */
    public function getNotifications() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $stmt = $this->db->prepare("
            SELECT * FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 50
        ");
        $stmt->execute([$userId]);
        $notifications = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['notifications' => $notifications]);
    }
    
    /**
     * Marcar como lida
     */
    public function markAsRead() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $notificationId = $data['notification_id'] ?? 0;
        
        $stmt = $this->db->prepare("
            UPDATE notifications 
            SET is_read = 1, read_at = NOW() 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$notificationId, $userId]);
        
        echo json_encode(['success' => true]);
    }
    
    /**
     * Criar notificação (uso interno)
     */
    public function create($userId, $type, $title, $message, $referenceType = null, $referenceId = null) {
        $stmt = $this->db->prepare("
            INSERT INTO notifications 
            (user_id, notification_type, title, message, reference_type, reference_id)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $type, $title, $message, $referenceType, $referenceId]);
        
        return $this->db->lastInsertId();
    }
}
