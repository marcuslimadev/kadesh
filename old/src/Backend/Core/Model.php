<?php
namespace App\Backend\Core;

use PDO;

class Model {
    protected static ?PDO $pdo = null;

    public static function getDB() {
        if (self::$pdo === null) {
            $isLocal = ($_SERVER['HTTP_HOST'] ?? '') === 'localhost' || strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1') === 0;

            if ($isLocal) {
                self::$pdo = new PDO('mysql:host=127.0.0.1;dbname=kadesh;charset=utf8mb4', 'root', '', [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            } else {
                self::$pdo = new PDO('mysql:host=127.0.0.1;dbname=mmbsites_kadesh;charset=utf8mb4', 'mmbsites_kadesh', 'kadesh@2025', [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            }
        }
        return self::$pdo;
    }
}
