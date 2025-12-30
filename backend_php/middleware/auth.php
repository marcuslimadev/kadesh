<?php
require_once __DIR__ . '/../utils/helpers.php';

class AuthMiddleware {
    public static function authenticate() {
        $token = Helpers::getBearerToken();
        if (!$token) {
            Helpers::jsonResponse(['error' => 'Token não fornecido'], 401);
        }

        $decoded = Helpers::verifyJWT($token);
        if (!$decoded) {
            Helpers::jsonResponse(['error' => 'Token inválido ou expirado'], 401);
        }

        return $decoded;
    }

    public static function isAdmin($user) {
        if (!isset($user['isAdmin']) || !$user['isAdmin']) {
            Helpers::jsonResponse(['error' => 'Acesso negado: Requer privilégios de administrador'], 403);
        }
    }
}
