<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
AuthMiddleware::isAdmin($user);

$data = json_decode(file_get_contents("php://input"), true);
if (!is_array($data) || empty($data)) {
    $data = $_POST;
}

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

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
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

    Helpers::jsonResponse([
        'message' => 'Anuncio criado',
        'data' => [
            'id' => $adId
        ]
    ], 201);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
