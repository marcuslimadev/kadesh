<?php
// Teste de login com dados corretos
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/kadesh/api/login';
$_SERVER['SCRIPT_NAME'] = '/kadesh/public/backend.php';

// Simular JSON input
$loginData = json_encode([
    'email' => 'admin@kadesh.com',
    'password' => 'Kadesh@2025'
]);

// Mock file_get_contents('php://input')
function file_get_contents($filename) {
    if ($filename === 'php://input') {
        return $GLOBALS['loginData'];
    }
    return false;
}

require_once __DIR__ . '/backend.php';
?>