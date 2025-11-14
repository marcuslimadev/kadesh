<?php
namespace App\Backend\Controllers;

use App\Backend\Models\User;

class UserController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    /**
     * Obter estatísticas do usuário (dashboard)
     */
    public function getStats() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        // Pegar tipo de usuário
        $stmt = $this->db->prepare("SELECT user_type FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        $userType = $user['user_type'] ?? 'contractor';
        
        $stats = [];
        
        if ($userType === 'contractor' || $userType === 'both') {
            // Projetos criados
            $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM projects WHERE user_id = ?");
            $stmt->execute([$userId]);
            $stats['projects_created'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
            
            // Projetos ativos
            $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM projects WHERE user_id = ? AND status = 'open'");
            $stmt->execute([$userId]);
            $stats['projects_active'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
            
            // Projetos concluídos
            $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM projects WHERE user_id = ? AND status = 'completed'");
            $stmt->execute([$userId]);
            $stats['projects_completed'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
        }
        
        if ($userType === 'provider' || $userType === 'both') {
            // Propostas enviadas
            $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM bids WHERE user_id = ?");
            $stmt->execute([$userId]);
            $stats['bids_sent'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
            
            // Propostas aceitas
            $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM bids WHERE user_id = ? AND status = 'accepted'");
            $stmt->execute([$userId]);
            $stats['bids_accepted'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
            
            // Trabalhos em andamento
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as total 
                FROM bids b
                INNER JOIN projects p ON b.project_id = p.id
                WHERE b.user_id = ? AND b.status = 'accepted' AND p.status = 'in_progress'
            ");
            $stmt->execute([$userId]);
            $stats['jobs_in_progress'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
        }
        
        // Saldo da carteira
        $stmt = $this->db->prepare("SELECT balance FROM wallets WHERE user_id = ?");
        $stmt->execute([$userId]);
        $wallet = $stmt->fetch(\PDO::FETCH_ASSOC);
        $stats['wallet_balance'] = $wallet['balance'] ?? 0;
        
        // Notificações não lidas
        $stmt = $this->db->prepare("SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND is_read = 0");
        $stmt->execute([$userId]);
        $stats['unread_notifications'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
        
        // Total ganho (para providers)
        if ($userType === 'provider' || $userType === 'both') {
            $stmt = $this->db->prepare("
                SELECT COALESCE(SUM(amount), 0) as total
                FROM wallet_transactions
                WHERE user_id = ? AND type = 'credit' AND description LIKE '%pagamento%'
            ");
            $stmt->execute([$userId]);
            $stats['total_earned'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
        }
        
        // Total gasto (para contractors)
        if ($userType === 'contractor' || $userType === 'both') {
            $stmt = $this->db->prepare("
                SELECT COALESCE(SUM(amount), 0) as total
                FROM wallet_transactions
                WHERE user_id = ? AND type = 'debit'
            ");
            $stmt->execute([$userId]);
            $stats['total_spent'] = $stmt->fetch(\PDO::FETCH_ASSOC)['total'] ?? 0;
        }
        
        echo json_encode($stats);
    }

    /**
     * Upload de documento para KYC
     */
    public function uploadDocument() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $documentType = $_POST['document_type'] ?? '';
        $documentNumber = $_POST['document_number'] ?? '';
        
        if (!isset($_FILES['document'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Arquivo não enviado']);
            return;
        }
        
        $file = $_FILES['document'];
        $uploadDir = __DIR__ . '/../../../storage/documents/';
        
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileName = $userId . '_' . $documentType . '_' . time() . '_' . basename($file['name']);
        $filePath = $uploadDir . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            $stmt = $this->db->prepare("
                INSERT INTO user_documents (user_id, document_type, document_number, file_path, file_name, file_size, mime_type, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            ");
            
            $stmt->execute([
                $userId,
                $documentType,
                $documentNumber,
                $filePath,
                $fileName,
                $file['size'],
                $file['type']
            ]);
            
            echo json_encode([
                'success' => true,
                'message' => 'Documento enviado com sucesso',
                'document_id' => $this->db->lastInsertId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao fazer upload']);
        }
    }
    
    /**
     * Listar documentos do usuário
     */
    public function getDocuments() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $stmt = $this->db->prepare("SELECT * FROM user_documents WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        $documents = $stmt->fetchAll(\PDO::FETCH_ASSOC);
        
        echo json_encode(['documents' => $documents]);
    }
    
    /**
     * Atualizar perfil completo
     */
    public function updateProfile() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Atualizar dados básicos do usuário
        if (isset($data['name'])) {
            $stmt = $this->db->prepare("UPDATE users SET name = ? WHERE id = ?");
            $stmt->execute([$data['name'], $userId]);
        }
        
        // Criar/atualizar profile estendido
        $stmt = $this->db->prepare("
            INSERT INTO user_profiles (user_id, cpf_cnpj, phone, address_street, address_number, address_city, address_state, address_zipcode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            cpf_cnpj = VALUES(cpf_cnpj),
            phone = VALUES(phone),
            address_street = VALUES(address_street),
            address_number = VALUES(address_number),
            address_city = VALUES(address_city),
            address_state = VALUES(address_state),
            address_zipcode = VALUES(address_zipcode)
        ");
        
        $stmt->execute([
            $userId,
            $data['cpf_cnpj'] ?? null,
            $data['phone'] ?? null,
            $data['address_street'] ?? null,
            $data['address_number'] ?? null,
            $data['address_city'] ?? null,
            $data['address_state'] ?? null,
            $data['address_zipcode'] ?? null
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Perfil atualizado']);
    }
    
    /**
     * Alternar papel (contratante/fornecedor)
     */
    public function switchRole() {
        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado']);
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        $newRole = $data['role'] ?? 'contractor';
        
        if (!in_array($newRole, ['contractor', 'provider', 'both'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Papel inválido']);
            return;
        }
        
        $stmt = $this->db->prepare("UPDATE users SET user_type = ? WHERE id = ?");
        $stmt->execute([$newRole, $userId]);
        
        // Log de auditoria
        $stmt = $this->db->prepare("
            INSERT INTO audit_logs (user_id, entity_type, entity_id, action, new_values, ip_address, hash_current)
            VALUES (?, 'user', ?, 'role_switch', ?, ?, ?)
        ");
        
        $stmt->execute([
            $userId,
            $userId,
            json_encode(['role' => $newRole]),
            $_SERVER['REMOTE_ADDR'] ?? '',
            hash('sha256', $userId . $newRole . time())
        ]);
        
        echo json_encode(['success' => true, 'role' => $newRole]);
    }
}
