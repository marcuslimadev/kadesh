<?php

class Helpers {
    public static function jsonResponse($data, $status = 200) {
        header("Content-Type: application/json; charset=UTF-8");
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    public static function getBearerToken() {
        $headers = function_exists('getallheaders') ? getallheaders() : [];

        // Normalizar chaves para case-insensitive (ex.: 'authorization')
        $normalized = [];
        foreach ($headers as $key => $value) {
            $normalized[strtolower((string) $key)] = $value;
        }

        $candidates = [];

        if (isset($normalized['authorization'])) {
            $candidates[] = $normalized['authorization'];
        }
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $candidates[] = $_SERVER['HTTP_AUTHORIZATION'];
        }
        if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $candidates[] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        foreach ($candidates as $authHeader) {
            if (!$authHeader) continue;
            if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public static function generateUUID() {
        return sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    // JWT Simples (para PHP puro sem dependências externas pesadas)
    // Em produção, recomenda-se usar firebase/php-jwt via composer
    public static function generateJWT($payload) {
        $secret = getenv('JWT_SECRET') ?: 'your_secret_key';
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function verifyJWT($token) {
        $secret = getenv('JWT_SECRET') ?: 'your_secret_key';
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        
        list($header, $payload, $signature) = $parts;
        
        $validSignature = hash_hmac('sha256', $header . "." . $payload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));
        
        if ($signature !== $base64UrlSignature) return false;
        
        $decodedPayload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
        
        // Verificar expiração se existir
        if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) return false;
        
        return $decodedPayload;
    }
}
