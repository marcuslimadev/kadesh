<?php
// Teste de login direto
header('Content-Type: application/json');

// Simular dados de login
$_POST['email'] = 'admin@kadesh.com';
$_POST['password'] = 'Kadesh@2025';

// Definir método como POST
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/kadesh/api/login';

// Incluir o backend
require_once __DIR__ . '/backend.php';
?>