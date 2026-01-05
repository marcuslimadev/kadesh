<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'DELETE') {
    Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$projectId = $_GET['id'] ?? null;
$attachmentId = $_GET['attachment_id'] ?? null;

if (!$projectId) {
    Helpers::jsonResponse(['error' => 'Projeto obrigatorio'], 400);
}

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['error' => 'Erro de conexao com o banco de dados'], 500);
}

try {
    $stmt = $conn->prepare("SELECT client_id FROM projects WHERE id = ?");
    $stmt->execute([$projectId]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$project) {
        Helpers::jsonResponse(['error' => 'Projeto nao encontrado'], 404);
    }

    if ($project['client_id'] !== $user['userId']) {
        Helpers::jsonResponse(['error' => 'Apenas o contratante pode alterar anexos'], 403);
    }

    if ($method === 'DELETE') {
        if (!$attachmentId) {
            Helpers::jsonResponse(['error' => 'Anexo obrigatorio'], 400);
        }

        $stmt = $conn->prepare("SELECT id, file_url FROM project_attachments WHERE id = ? AND project_id = ?");
        $stmt->execute([$attachmentId, $projectId]);
        $attachment = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$attachment) {
            Helpers::jsonResponse(['error' => 'Anexo nao encontrado'], 404);
        }

        $stmt = $conn->prepare("DELETE FROM project_attachments WHERE id = ?");
        $stmt->execute([$attachmentId]);

        if (!empty($attachment['file_url'])) {
            $uploadRoot = rtrim(getenv('UPLOAD_PATH') ?: (__DIR__ . '/../../uploads'), '/\\');
            $relative = str_replace(['/api/uploads/', '/uploads/'], '', $attachment['file_url']);
            $filePath = $uploadRoot . DIRECTORY_SEPARATOR . $relative;
            if (is_file($filePath)) {
                @unlink($filePath);
            }
        }

        Helpers::jsonResponse(['message' => 'Anexo removido']);
    }

    if (empty($_FILES['file'])) {
        Helpers::jsonResponse(['error' => 'Arquivo nao enviado'], 400);
    }

    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        Helpers::jsonResponse(['error' => 'Falha no upload'], 400);
    }

    $maxSize = intval(getenv('MAX_FILE_SIZE') ?: 10485760);
    if ($file['size'] > $maxSize) {
        Helpers::jsonResponse(['error' => 'Arquivo acima do tamanho permitido'], 400);
    }

    $uploadRoot = rtrim(getenv('UPLOAD_PATH') ?: (__DIR__ . '/../../uploads'), '/\\');
    if (!is_dir($uploadRoot)) {
        mkdir($uploadRoot, 0775, true);
    }

    $originalName = $file['name'];
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    $safeName = Helpers::generateUUID();
    if ($extension) {
        $safeName .= '.' . $extension;
    }

    $targetPath = $uploadRoot . DIRECTORY_SEPARATOR . $safeName;
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        Helpers::jsonResponse(['error' => 'Nao foi possivel salvar o arquivo'], 500);
    }

    $fileUrl = '/api/uploads/' . $safeName;
    $attachmentId = Helpers::generateUUID();

    $stmt = $conn->prepare("
        INSERT INTO project_attachments (id, project_id, filename, original_name, file_url, file_size, mime_type, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $attachmentId,
        $projectId,
        $safeName,
        $originalName,
        $fileUrl,
        $file['size'],
        $file['type'],
        $user['userId']
    ]);

    $stmt = $conn->prepare("
        INSERT INTO file_uploads (id, user_id, filename, original_name, file_url, file_path, file_size, mime_type, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'attachment')
    ");
    $stmt->execute([
        Helpers::generateUUID(),
        $user['userId'],
        $safeName,
        $originalName,
        $fileUrl,
        $targetPath,
        $file['size'],
        $file['type']
    ]);

    Helpers::jsonResponse([
        'attachment' => [
            'id' => $attachmentId,
            'filename' => $safeName,
            'original_name' => $originalName,
            'file_url' => $fileUrl,
            'file_size' => intval($file['size']),
            'mime_type' => $file['type']
        ]
    ], 201);
} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
