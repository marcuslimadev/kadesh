<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

function ensureAdvertisementsTable($conn) {
    $check = $conn->prepare("SHOW TABLES LIKE 'advertisements'");
    $check->execute();
    if ($check->fetch()) {
        return;
    }

    $conn->exec("
        CREATE TABLE IF NOT EXISTS advertisements (
            id VARCHAR(36) NOT NULL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            link_url VARCHAR(500),
            image_url VARCHAR(500),
            position ENUM('left', 'right') NOT NULL DEFAULT 'left',
            slot INT NOT NULL DEFAULT 1,
            is_active BOOLEAN DEFAULT TRUE,
            impression_count INT DEFAULT 0,
            click_count INT DEFAULT 0,
            start_date DATETIME NULL,
            end_date DATETIME NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    ensureAdvertisementsTable($conn);

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['id'])) {
        $adId = $_GET['id'];
        $stmt = $conn->prepare("UPDATE advertisements SET click_count = click_count + 1 WHERE id = ?");
        $stmt->execute([$adId]);
        Helpers::jsonResponse(['message' => 'Click registrado']);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
    }

    $position = $_GET['position'] ?? null;
    $limit = isset($_GET['limit']) ? max(1, min(intval($_GET['limit']), 10)) : 4;
    $now = date('Y-m-d H:i:s');

    $conditions = ['is_active = 1', '(start_date IS NULL OR start_date <= ?)', '(end_date IS NULL OR end_date >= ?)'];
    $params = [$now, $now];

    if ($position === 'left' || $position === 'right') {
        $conditions[] = 'position = ?';
        $params[] = $position;
    }

    $whereSql = implode(' AND ', $conditions);
    $sql = "
        SELECT id, title, description, link_url, image_url, position, slot, impression_count, click_count, start_date, end_date
        FROM advertisements
        WHERE $whereSql
        ORDER BY slot ASC, created_at DESC
        LIMIT :limit
    ";
    $stmt = $conn->prepare($sql);
    foreach ($params as $index => $value) {
        $stmt->bindValue($index + 1, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($ads)) {
        $ids = array_map(function ($ad) {
            return $ad['id'];
        }, $ads);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $update = $conn->prepare("UPDATE advertisements SET impression_count = impression_count + 1 WHERE id IN ($placeholders)");
        $update->execute($ids);
    }

    Helpers::jsonResponse($ads);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
