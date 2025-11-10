<?php
namespace App\Backend\Controllers;

class DisputeController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Abrir disputa
     */
    public function openDispute() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $projectId = $data['project_id'] ?? 0;
        $reason = $data['reason'] ?? '';
        $description = $data['description'] ?? '';
        
        // Verificar se usuário faz parte do projeto
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
        
        // Criar disputa
        $stmt = $this->db->prepare("
            INSERT INTO disputes 
            (project_id, opened_by, reason, description, status)
            VALUES (?, ?, ?, ?, 'open')
        ");
        $stmt->execute([$projectId, $userId, $reason, $description]);
        
        $disputeId = $this->db->lastInsertId();
        
        // Congelar projeto
        $stmt = $this->db->prepare("UPDATE projects SET status = 'disputed' WHERE id = ?");
        $stmt->execute([$projectId]);
        
        echo json_encode([
            'success' => true,
            'dispute_id' => $disputeId,
            'message' => 'Disputa aberta. Projeto congelado.'
        ]);
    }
    
    /**
     * Adicionar evidência
     */
    public function addEvidence() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $disputeId = $_POST['dispute_id'] ?? 0;
        $description = $_POST['description'] ?? '';
        
        // Upload
        $evidenceUrl = null;
        if (isset($_FILES['evidence'])) {
            $file = $_FILES['evidence'];
            $uploadDir = __DIR__ . '/../../../storage/disputes/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            
            $fileName = uniqid() . '_' . basename($file['name']);
            $uploadPath = $uploadDir . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
                $evidenceUrl = '/storage/disputes/' . $fileName;
            }
        }
        
        $stmt = $this->db->prepare("
            INSERT INTO dispute_evidences 
            (dispute_id, submitted_by, description, file_url)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$disputeId, $userId, $description, $evidenceUrl]);
        
        echo json_encode(['success' => true, 'evidence_url' => $evidenceUrl]);
    }
    
    /**
     * Resolver disputa (admin)
     */
    public function resolveDispute() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        // Verificar se é admin
        $stmt = $this->db->prepare("SELECT role FROM admin_users WHERE user_id = ?");
        $stmt->execute([$userId]);
        $admin = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$admin) {
            http_response_code(403);
            echo json_encode(['error' => 'Apenas administradores']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $disputeId = $data['dispute_id'] ?? 0;
        $decision = $data['decision'] ?? ''; // 'favor_contractor' ou 'favor_provider'
        $notes = $data['notes'] ?? '';
        
        // Atualizar disputa
        $stmt = $this->db->prepare("
            UPDATE disputes 
            SET status = 'resolved', resolved_by = ?, resolution_notes = ?, resolved_at = NOW()
            WHERE id = ?
        ");
        $stmt->execute([$userId, $notes, $disputeId]);
        
        // Buscar escrow para redistribuir fundos
        $stmt = $this->db->prepare("
            SELECT ea.* FROM escrow_accounts ea
            JOIN disputes d ON ea.project_id = d.project_id
            WHERE d.id = ?
        ");
        $stmt->execute([$disputeId]);
        $escrow = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if ($escrow && $escrow['held_amount'] > 0) {
            // Redistribuir baseado na decisão
            $refundTo = ($decision === 'favor_contractor') ? $escrow['contractor_id'] : $escrow['provider_id'];
            $amount = $escrow['held_amount'];
            
            // Atualizar carteira
            $stmt = $this->db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");
            $stmt->execute([$amount, $refundTo]);
            
            // Atualizar escrow
            $stmt = $this->db->prepare("UPDATE escrow_accounts SET held_amount = 0, refunded_amount = ? WHERE id = ?");
            $stmt->execute([$amount, $escrow['id']]);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Disputa resolvida'
        ]);
    }
}
