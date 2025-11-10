<?php
namespace App\Backend\Controllers;

use App\Backend\Models\User;

class UserController {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
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
