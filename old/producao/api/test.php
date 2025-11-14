<?php
// Teste direto da API - Debug
header("Content-Type: application/json");

echo json_encode([
    'status' => 'API_FUNCIONANDO',
    'timestamp' => date('Y-m-d H:i:s'),
    'request_uri' => $_SERVER['REQUEST_URI'],
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'path_info' => $_SERVER['PATH_INFO'] ?? 'N/A',
    'query_string' => $_SERVER['QUERY_STRING'] ?? 'N/A',
    'http_host' => $_SERVER['HTTP_HOST'],
    'server_name' => $_SERVER['SERVER_NAME'],
    'script_name' => $_SERVER['SCRIPT_NAME'],
    'document_root' => $_SERVER['DOCUMENT_ROOT'],
    'kadesh_path_check' => strpos($_SERVER['REQUEST_URI'], '/kadesh/') === 0 ? 'SIM' : 'NAO'
]);
?>