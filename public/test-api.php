<?php
// Simular requisição API para health check
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/kadesh/api/health';
$_SERVER['SCRIPT_NAME'] = '/kadesh/public/backend.php';

// Incluir backend
require_once __DIR__ . '/backend.php';
?>