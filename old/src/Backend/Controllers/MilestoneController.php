<?php
namespace App\Backend\Controllers;

class MilestoneController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Criar marcos (provider)
     */
    public function createMilestones() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $escrowId = $data['escrow_id'] ?? 0;
        $milestones = $data['milestones'] ?? [];
        
        // Verificar se escrow pertence ao provider
        $stmt = $this->db->prepare("SELECT * FROM escrow_accounts WHERE id = ? AND provider_id = ?");
        $stmt->execute([$escrowId, $userId]);
        $escrow = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$escrow) {
            http_response_code(404);
            echo json_encode(['error' => 'Escrow não encontrado']);
            return;
        }
        
        // Validar soma = total_amount
        $total = array_sum(array_column($milestones, 'amount'));
        if (abs($total - $escrow['total_amount']) > 0.01) {
            http_response_code(422);
            echo json_encode(['error' => 'Soma dos marcos diferente do total']);
            return;
        }
        
        // Criar marcos
        $order = 1;
        foreach ($milestones as $m) {
            $stmt = $this->db->prepare("
                INSERT INTO project_milestones 
                (escrow_id, order_number, title, description, amount, status)
                VALUES (?, ?, ?, ?, ?, 'pending')
            ");
            $stmt->execute([
                $escrowId,
                $order++,
                $m['title'],
                $m['description'],
                $m['amount']
            ]);
        }
        
        echo json_encode(['success' => true, 'message' => 'Marcos criados']);
    }
    
    /**
     * Enviar evidência (provider)
     */
    public function submitEvidence() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $milestoneId = $_POST['milestone_id'] ?? 0;
        $description = $_POST['description'] ?? '';
        
        // Verificar propriedade
        $stmt = $this->db->prepare("
            SELECT pm.*, ea.provider_id 
            FROM project_milestones pm
            JOIN escrow_accounts ea ON pm.escrow_id = ea.id
            WHERE pm.id = ? AND ea.provider_id = ?
        ");
        $stmt->execute([$milestoneId, $userId]);
        $milestone = $stmt->fetch(\PDO::FETCH_ASSOC);
        
        if (!$milestone) {
            http_response_code(404);
            echo json_encode(['error' => 'Marco não encontrado']);
            return;
        }
        
        // Upload de arquivo
        $evidenceUrl = null;
        if (isset($_FILES['evidence'])) {
            $file = $_FILES['evidence'];
            $uploadDir = __DIR__ . '/../../../storage/milestones/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            
            $fileName = uniqid() . '_' . basename($file['name']);
            $uploadPath = $uploadDir . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
                $evidenceUrl = '/storage/milestones/' . $fileName;
            }
        }
        
        // Atualizar marco
        $stmt = $this->db->prepare("
            UPDATE project_milestones 
            SET status = 'submitted', submitted_at = NOW(), evidence_description = ?, evidence_url = ?
            WHERE id = ?
        ");
        $stmt->execute([$description, $evidenceUrl, $milestoneId]);
        
        echo json_encode([
            'success' => true,
            'evidence_url' => $evidenceUrl,
            'message' => 'Evidência enviada para aprovação'
        ]);
    }
    
    /**
     * Listar marcos de um projeto
     */
    public function getMilestones() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $projectId = $_GET['project_id'] ?? 0;
        
        $stmt = $this->db->prepare("
            SELECT pm.* 
            FROM project_milestones pm
            JOIN escrow_accounts ea ON pm.escrow_id = ea.id
            WHERE ea.project_id = ? 
              AND (ea.contractor_id = ? OR ea.provider_id = ?)
            ORDER BY pm.order_number ASC
        ");
        $stmt->execute([$projectId, $userId, $userId]);
        $milestones = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['milestones' => $milestones]);
    }
}
