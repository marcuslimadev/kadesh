<?php

class Helpers {
    private static function jwtSecrets() {
        $secrets = [];
        $current = getenv('JWT_SECRET');
        if ($current) {
            $secrets[] = $current;
        }

        $host = $_SERVER['HTTP_HOST'] ?? '';
        $isLocalHost = preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/', $host) === 1;
        if ($isLocalHost) {
            $secrets[] = 'dev_secret_key_change_in_production_min_32_chars';
            $secrets[] = '8827f0f6bd3535ae7de20e35b46499e906da9745360e9bbc7ce7aac4a100c507eeeb1d952cfc5ce590d903f96575e688abdbe2b9219da55819383e320c182416';
        }

        $secrets[] = 'your_secret_key';
        return array_values(array_unique(array_filter($secrets)));
    }

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
        $secret = self::jwtSecrets()[0] ?? 'your_secret_key';
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function verifyJWT($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        
        list($header, $payload, $signature) = $parts;

        foreach (self::jwtSecrets() as $secret) {
            $validSignature = hash_hmac('sha256', $header . "." . $payload, $secret, true);
            $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));

            if (!hash_equals($base64UrlSignature, $signature)) {
                continue;
            }

            $decodedPayload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
            if (!is_array($decodedPayload)) {
                return false;
            }

            if (isset($decodedPayload['exp']) && $decodedPayload['exp'] < time()) {
                return false;
            }

            return $decodedPayload;
        }

        return false;
    }
}
