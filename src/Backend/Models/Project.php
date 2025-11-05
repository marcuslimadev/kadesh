<?php
namespace App\Backend\Models;

use App\Backend\Core\Model;
use PDO;

class Project extends Model {
    public static function findAll(array $filters = []): array {
        $db = self::getDB();
        $sql = 'SELECT p.*, u.name as user_name FROM projects p LEFT JOIN users u ON p.contractor_id = u.id WHERE 1=1';
        $params = [];

        if (!empty($filters['keyword'])) {
            $sql .= ' AND p.title LIKE ?';
            $params[] = "%{$filters['keyword']}%";
        }

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function findById(int $id): ?array {
        $db = self::getDB();
        $stmt = $db->prepare('SELECT * FROM projects WHERE id = ?');
        $stmt->execute([$id]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);
        return $project ?: null;
    }
}
