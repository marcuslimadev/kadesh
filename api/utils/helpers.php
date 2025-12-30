<?php

class Helpers {
    public static function jsonResponse($data, $status = 200) {
        header("Content-Type: application/json; charset=UTF-8");
        http_response_code($status);
        echo json_encode($data);
        exit;
    }

    public static function getBearerToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            if (preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
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
