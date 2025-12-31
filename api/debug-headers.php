<?php
header('Content-Type: application/json');

$headers = getallheaders();
$normalized = [];
foreach ($headers as $key => $value) {
    $normalized[strtolower((string) $key)] = $value;
}

$authHeader = $normalized['authorization'] ?? ($headers['Authorization'] ?? 'NENHUM');

$response = [
    'message' => 'Debug endpoint',
    'headers_recebidos' => $headers,
    'authorization_header' => $authHeader,
    'todos_headers' => $_SERVER
];

echo json_encode($response, JSON_PRETTY_PRINT);
