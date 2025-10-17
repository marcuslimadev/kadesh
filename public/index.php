<?php
// Kadesh - Front controller
$docroot = __DIR__;
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';

// Parse URL path
$path = parse_url($requestUri, PHP_URL_PATH) ?: '/';

// Remover /kadesh/ do início se existir
if (strpos($path, '/kadesh/') === 0) {
    $path = substr($path, 7); // Remove '/kadesh'
}

// 1) API endpoints vão para backend.php
if (preg_match('#^/api(/|$)#', $path)) {
    require $docroot . '/backend.php';
    exit;
}

// 2) Servir assets do build
if (preg_match('#^/assets/(.+)$#', $path, $matches)) {
    $assetFile = $docroot . '/build/assets/' . $matches[1];
    if (is_file($assetFile)) {
        $ext = strtolower(pathinfo($assetFile, PATHINFO_EXTENSION));
        $mime = [
            'css' => 'text/css',
            'js'  => 'application/javascript',
            'json'=> 'application/json',
        ][$ext] ?? 'application/octet-stream';
        
        header('Content-Type: ' . $mime);
        header('Cache-Control: public, max-age=31536000');
        readfile($assetFile);
        exit;
    }
}

// 3) Servir outros arquivos estáticos se existirem
$target = realpath($docroot . $path);
$docrootReal = realpath($docroot);
if ($target !== false && $docrootReal !== false && strpos($target, $docrootReal) === 0 && is_file($target)) {
    $ext = strtolower(pathinfo($target, PATHINFO_EXTENSION));
    $mime = [
        'css' => 'text/css',
        'js'  => 'application/javascript',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'ico' => 'image/x-icon',
    ][$ext] ?? 'application/octet-stream';

    header('Content-Type: ' . $mime);
    header('Cache-Control: public, max-age=31536000');
    readfile($target);
    exit;
}

// 4) SPA fallback -> build/index.html
$index = $docroot . '/build/index.html';
if (is_file($index)) {
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
    readfile($index);
    exit;
}

http_response_code(404);
echo "Not Found";

