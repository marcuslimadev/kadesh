<?php
// Test endpoint - mostra todas as variáveis
header('Content-Type: application/json');

$data = [
    'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? 'N/A',
    'PATH_INFO' => $_SERVER['PATH_INFO'] ?? 'N/A',
    'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'] ?? 'N/A',
    'QUERY_STRING' => $_SERVER['QUERY_STRING'] ?? 'N/A',
    'POST_DATA' => file_get_contents('php://input'),
    'PARSED_POST' => json_decode(file_get_contents('php://input'), true),
];

echo json_encode($data, JSON_PRETTY_PRINT);
?>