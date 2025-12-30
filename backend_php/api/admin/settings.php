<?php
/**
 * GET/PUT/POST /admin/settings
 * Gerencia configurações do sistema
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = AuthMiddleware::authenticate();
AuthMiddleware::isAdmin($user);

$db = new Database();
$conn = $db->getConnection();

// GET - Lista configurações
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->prepare("SELECT `key`, value, description, is_public FROM system_settings ORDER BY `key`");
        $stmt->execute();
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Converter para objeto key-value
        $settingsObj = [];
        foreach ($settings as $s) {
            $settingsObj[$s['key']] = [
                'value' => $s['value'],
                'description' => $s['description'],
                'is_public' => (bool)$s['is_public']
            ];
        }

        Helpers::jsonResponse(['settings' => $settingsObj]);

    } catch (PDOException $e) {
        Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
    }

// PUT - Atualiza uma configuração
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $key = $_GET['key'] ?? null;
    
    if (!$key) {
        Helpers::jsonResponse(['error' => 'Chave da configuração é obrigatória'], 400);
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $value = $data['value'] ?? null;

    try {
        $stmt = $conn->prepare("SELECT id FROM system_settings WHERE `key` = ?");
        $stmt->execute([$key]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            Helpers::jsonResponse(['error' => 'Configuração não encontrada'], 404);
        }

        $stmt = $conn->prepare("UPDATE system_settings SET value = ?, updated_at = NOW() WHERE `key` = ?");
        $stmt->execute([$value, $key]);

        Helpers::jsonResponse(['message' => 'Configuração atualizada com sucesso']);

    } catch (PDOException $e) {
        Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
    }

// POST - Cria nova configuração
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $key = $data['key'] ?? null;
    $value = $data['value'] ?? null;
    $description = $data['description'] ?? null;
    $isPublic = $data['is_public'] ?? false;

    if (!$key) {
        Helpers::jsonResponse(['error' => 'Chave da configuração é obrigatória'], 400);
    }

    try {
        // Verificar se já existe
        $stmt = $conn->prepare("SELECT id FROM system_settings WHERE `key` = ?");
        $stmt->execute([$key]);
        if ($stmt->fetch()) {
            Helpers::jsonResponse(['error' => 'Configuração já existe'], 400);
        }

        $settingId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        $stmt = $conn->prepare("
            INSERT INTO system_settings (id, `key`, value, description, is_public)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$settingId, $key, $value, $description, $isPublic ? 1 : 0]);

        Helpers::jsonResponse(['message' => 'Configuração criada com sucesso'], 201);

    } catch (PDOException $e) {
        Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
    }

} else {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}
