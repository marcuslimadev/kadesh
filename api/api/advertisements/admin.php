<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

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

$user = AuthMiddleware::authenticate();
AuthMiddleware::isAdmin($user);

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

ensureAdvertisementsTable($conn);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->prepare("
        SELECT id, title, description, link_url, image_url, position, slot, is_active, impression_count, click_count, start_date, end_date, created_at
        FROM advertisements
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($ads as &$ad) {
        $ad['is_active'] = (bool)$ad['is_active'];
        $ad['slot'] = intval($ad['slot']);
        $ad['impression_count'] = intval($ad['impression_count']);
        $ad['click_count'] = intval($ad['click_count']);
    }
    Helpers::jsonResponse($ads);
}

$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

if ($method === 'POST') {
    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');
    $linkUrl = $data['link_url'] ?? null;
    $imageUrl = $data['image_url'] ?? null;
    $position = $data['position'] ?? 'left';
    $slot = isset($data['slot']) ? intval($data['slot']) : 1;
    $isActive = isset($data['is_active']) ? (bool)$data['is_active'] : true;
    $startDate = $data['start_date'] ?? null;
    $endDate = $data['end_date'] ?? null;

    if ($title === '' || $description === '') {
        Helpers::jsonResponse(['error' => 'Titulo e descricao sao obrigatorios'], 400);
    }

    if ($position !== 'left' && $position !== 'right') {
        Helpers::jsonResponse(['error' => 'Posicao invalida'], 400);
    }

    $adId = Helpers::generateUUID();
    $stmt = $conn->prepare("
        INSERT INTO advertisements (id, title, description, link_url, image_url, position, slot, is_active, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $adId,
        $title,
        $description,
        $linkUrl,
        $imageUrl,
        $position,
        $slot,
        $isActive ? 1 : 0,
        $startDate,
        $endDate
    ]);

    Helpers::jsonResponse(['message' => 'Anuncio criado', 'id' => $adId], 201);
}

if ($method === 'PUT' && isset($_GET['id'])) {
    $adId = $_GET['id'];
    $fields = [
        'title' => trim($data['title'] ?? ''),
        'description' => trim($data['description'] ?? ''),
        'link_url' => $data['link_url'] ?? null,
        'image_url' => $data['image_url'] ?? null,
        'position' => $data['position'] ?? 'left',
        'slot' => isset($data['slot']) ? intval($data['slot']) : 1,
        'is_active' => isset($data['is_active']) ? (bool)$data['is_active'] : true,
        'start_date' => $data['start_date'] ?? null,
        'end_date' => $data['end_date'] ?? null
    ];

    if ($fields['title'] === '' || $fields['description'] === '') {
        Helpers::jsonResponse(['error' => 'Titulo e descricao sao obrigatorios'], 400);
    }

    if ($fields['position'] !== 'left' && $fields['position'] !== 'right') {
        Helpers::jsonResponse(['error' => 'Posicao invalida'], 400);
    }

    $stmt = $conn->prepare("
        UPDATE advertisements
        SET title = ?, description = ?, link_url = ?, image_url = ?, position = ?, slot = ?, is_active = ?, start_date = ?, end_date = ?
        WHERE id = ?
    ");
    $stmt->execute([
        $fields['title'],
        $fields['description'],
        $fields['link_url'],
        $fields['image_url'],
        $fields['position'],
        $fields['slot'],
        $fields['is_active'] ? 1 : 0,
        $fields['start_date'],
        $fields['end_date'],
        $adId
    ]);

    Helpers::jsonResponse(['message' => 'Anuncio atualizado']);
}

$toggleAction = $_GET['action'] ?? null;
if (!$toggleAction) {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '';
    if (substr($path, -7) === '/toggle') {
        $toggleAction = 'toggle';
    }
}

if ($method === 'PATCH' && isset($_GET['id']) && $toggleAction === 'toggle') {
    $adId = $_GET['id'];
    $stmt = $conn->prepare("UPDATE advertisements SET is_active = IF(is_active = 1, 0, 1) WHERE id = ?");
    $stmt->execute([$adId]);
    Helpers::jsonResponse(['message' => 'Status atualizado']);
}

if ($method === 'DELETE' && isset($_GET['id'])) {
    $adId = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM advertisements WHERE id = ?");
    $stmt->execute([$adId]);
    Helpers::jsonResponse(['message' => 'Anuncio removido']);
}

Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
