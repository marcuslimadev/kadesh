<?php
// Kadesh - Front controller leve (sem Laravel)
// Objetivos:
// - Roteia /api e /sanctum para backend.php
// - Serve arquivos estáticos (assets, favicon, etc.)
// - Serve a SPA (index.html) para qualquer outra rota

// Base paths
$docroot = __DIR__;
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH) ?: '/';

// 1) API endpoints vão para backend.php
if (preg_match('#^/(api|sanctum)(/|$)#', $path)) {
    require $docroot . '/backend.php';
    exit;
}

// 2) Tentar servir arquivo estático se existir
$target = realpath($docroot . $path);
$docrootReal = realpath($docroot);
if ($target !== false && $docrootReal !== false && strpos($target, $docrootReal) === 0 && is_file($target)) {
    // Mapear mime básico
    $ext = strtolower(pathinfo($target, PATHINFO_EXTENSION));
    $mime = [
        'css' => 'text/css',
        'js'  => 'application/javascript',
        'mjs' => 'application/javascript',
        'json'=> 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg'=> 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff'=> 'font/woff',
        'woff2'=>'font/woff2',
    ][$ext] ?? 'application/octet-stream';

    header('Content-Type: ' . $mime);
    header('Cache-Control: public, max-age=31536000');
    readfile($target);
    exit;
}

// 3) SPA fallback -> index.html
$index = $docroot . '/index.html';
if (is_file($index)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($index);
    exit;
}

http_response_code(404);
header('Content-Type: text/plain; charset=UTF-8');
echo "Not Found";
