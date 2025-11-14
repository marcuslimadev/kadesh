<?php
namespace App\Backend\Models;

use App\Backend\Core\Model;
use PDO;

class User extends Model {
    public static function findById(int $id): ?array {
        $db = self::getDB();
        $stmt = $db->prepare('SELECT id, name, email, user_type FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    public static function findByEmail(string $email): ?array {
        $db = self::getDB();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user ?: null;
    }

    public static function create(string $name, string $email, string $password, string $type): int {
        $db = self::getDB();
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare('INSERT INTO users (name, email, password, user_type, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())');
        $stmt->execute([$name, $email, $hashedPassword, $type]);
        return (int)$db->lastInsertId();
    }
}
