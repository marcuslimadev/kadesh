<?php
// Simular requisição de login para /api/login
$_SERVER['REQUEST_URI'] = '/kadesh/api/login';
$_SERVER['REQUEST_METHOD'] = 'POST';

// Incluir o backend que vai processar
require __DIR__ . '/backend.php';
?>