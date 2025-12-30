<?php
/**
 * POST /auth/logout
 * Logout do usuário (opcional - para tracking)
 */
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Helpers::jsonResponse(['error' => 'Método não permitido'], 405);
}

$user = AuthMiddleware::authenticate();

// Implementar blacklist de tokens se necessário no futuro
Helpers::jsonResponse([
    'message' => 'Logout realizado com sucesso'
]);
