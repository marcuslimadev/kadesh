<?php
namespace App\Backend\Models;

use App\Backend\Core\Model;
use PDO;

class Project extends Model {
    /**
     * Lista todos os projetos (com filtros opcionais)
     */
    public static function findAll(array $filters = []): array {
        $db = self::getDB();
        $sql = 'SELECT p.*, u.name as user_name, 
                (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bids_count,
                (SELECT MIN(amount) FROM bids WHERE project_id = p.id) as lowest_bid
                FROM projects p 
                LEFT JOIN users u ON p.contractor_id = u.id 
                WHERE 1=1';
        $params = [];

        if (!empty($filters['keyword'])) {
            $sql .= ' AND p.title LIKE ?';
            $params[] = "%{$filters['keyword']}%";
        }

        if (!empty($filters['status'])) {
            $sql .= ' AND p.status = ?';
            $params[] = $filters['status'];
        }

        if (!empty($filters['category'])) {
            $sql .= ' AND p.category = ?';
            $params[] = $filters['category'];
        }

        $sql .= ' ORDER BY p.created_at DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Busca projeto por ID
     */
    public static function findById(int $id): ?array {
        $db = self::getDB();
        $sql = 'SELECT p.*, u.name as user_name, u.email as user_email,
                (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bids_count,
                (SELECT MIN(amount) FROM bids WHERE project_id = p.id) as lowest_bid
                FROM projects p 
                LEFT JOIN users u ON p.contractor_id = u.id 
                WHERE p.id = ?';
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        return $project ?: null;
    }

    /**
     * Busca projetos por ID do usuário
     */
    public static function findByUserId(int $userId): array {
        $db = self::getDB();
        $sql = 'SELECT p.*, 
                (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bids_count,
                (SELECT MIN(amount) FROM bids WHERE project_id = p.id) as lowest_bid
                FROM projects p 
                WHERE p.contractor_id = ?
                ORDER BY p.created_at DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Cria novo projeto
     */
    public static function create(array $data): int {
        $db = self::getDB();
        
        $sql = 'INSERT INTO projects (
            contractor_id, title, description, max_budget, 
            project_deadline, bidding_ends_at, status, 
            required_skills, attachments, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())';
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            $data['user_id'],
            $data['title'],
            $data['description'],
            $data['max_budget'],
            $data['deadline'] ?? null,
            $data['end_date'] ?? null,
            $data['status'],
            $data['requirements'] ?? null,
            $data['attachments'] ?? null
        ]);
        
        return (int)$db->lastInsertId();
    }

    /**
     * Atualiza projeto
     */
    public static function update(int $id, array $data): bool {
        $db = self::getDB();
        
        $fields = [];
        $values = [];
        
        foreach ($data as $key => $value) {
            $fields[] = "$key = ?";
            $values[] = $value;
        }
        
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        
        $sql = 'UPDATE projects SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $db->prepare($sql);
        
        return $stmt->execute($values);
    }

    /**
     * Deleta projeto
     */
    public static function delete(int $id): bool {
        $db = self::getDB();
        
        // Deletar propostas relacionadas primeiro
        $stmt = $db->prepare('DELETE FROM bids WHERE project_id = ?');
        $stmt->execute([$id]);
        
        // Deletar projeto
        $stmt = $db->prepare('DELETE FROM projects WHERE id = ?');
        return $stmt->execute([$id]);
    }
}
