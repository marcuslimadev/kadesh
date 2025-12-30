<?php
/**
 * PUT /users/profile
 * Atualiza perfil do usuário logado
 */
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$data = json_decode(file_get_contents("php://input"), true);

$db = new Database();
$conn = $db->getConnection();

try {
    $conn->beginTransaction();

    // Campos atualizáveis do usuário
    $allowedFields = ['name', 'phone', 'bio', 'website', 'location', 'timezone', 'language', 'avatar_url'];
    $updates = [];
    $params = [];

    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updates[] = "$field = ?";
            $params[] = $data[$field];
        }
    }

    if (!empty($updates)) {
        $params[] = $user['userId'];
        $sql = "UPDATE users SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
    }

    // Atualizar perfil de provider se existir dados
    if (isset($data['provider_profile'])) {
        $pp = $data['provider_profile'];
        
        // Verificar se já existe
        $stmt = $conn->prepare("SELECT id FROM provider_profiles WHERE user_id = ?");
        $stmt->execute([$user['userId']]);
        $existingProfile = $stmt->fetch(PDO::FETCH_ASSOC);

        $skills = isset($pp['skills']) ? json_encode($pp['skills']) : null;

        if ($existingProfile) {
            $stmt = $conn->prepare("
                UPDATE provider_profiles SET
                    title = COALESCE(?, title),
                    hourly_rate = COALESCE(?, hourly_rate),
                    skills = COALESCE(?, skills),
                    experience_years = COALESCE(?, experience_years),
                    portfolio_url = COALESCE(?, portfolio_url),
                    github_url = COALESCE(?, github_url),
                    linkedin_url = COALESCE(?, linkedin_url),
                    availability = COALESCE(?, availability),
                    updated_at = NOW()
                WHERE user_id = ?
            ");
            $stmt->execute([
                $pp['title'] ?? null,
                $pp['hourly_rate'] ?? null,
                $skills,
                $pp['experience_years'] ?? null,
                $pp['portfolio_url'] ?? null,
                $pp['github_url'] ?? null,
                $pp['linkedin_url'] ?? null,
                $pp['availability'] ?? null,
                $user['userId']
            ]);
        } else {
            // Criar novo perfil
            $profileId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );

            $stmt = $conn->prepare("
                INSERT INTO provider_profiles (id, user_id, title, hourly_rate, skills, experience_years, 
                    portfolio_url, github_url, linkedin_url, availability)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $profileId,
                $user['userId'],
                $pp['title'] ?? null,
                $pp['hourly_rate'] ?? null,
                $skills,
                $pp['experience_years'] ?? 0,
                $pp['portfolio_url'] ?? null,
                $pp['github_url'] ?? null,
                $pp['linkedin_url'] ?? null,
                $pp['availability'] ?? 'available'
            ]);
        }
    }

    $conn->commit();

    // Retornar usuário atualizado
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$user['userId']]);
    $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);
    unset($updatedUser['password']);

    Helpers::jsonResponse([
        'message' => 'Perfil atualizado com sucesso',
        'user' => $updatedUser
    ]);

} catch (PDOException $e) {
    $conn->rollBack();
    Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}
