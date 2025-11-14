<?php
// Kadesh - Front controller for jQuery Frontend
$docroot = __DIR__;
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';

// Parse URL path
$path = parse_url($requestUri, PHP_URL_PATH) ?: '/';

// Remove /kadesh/ from the beginning if it exists
if (strpos($path, '/kadesh/') === 0) {
    $path = substr($path, 7); // Remove '/kadesh'
}

// 1) API endpoints go to backend.php
if (preg_match('#^/api(/|$)#', $path)) {
    require $docroot . '/backend.php';
    exit;
}

// 2) Serve static assets for the jQuery frontend (e.g., /assets/css/style.css)
if (preg_match('#^/assets/(.+)$#', $path, $matches)) {
    $assetFile = $docroot . '/jquery-frontend/assets/' . $matches[1];
    if (is_file($assetFile)) {
        $ext = strtolower(pathinfo($assetFile, PATHINFO_EXTENSION));
        $mime = [
            'css' => 'text/css',
            'js'  => 'application/javascript',
        ][$ext] ?? 'application/octet-stream';
        
        header('Content-Type: ' . $mime);
        readfile($assetFile);
        exit;
    }
}

// 3) Serve HTML partials for the jQuery frontend (e.g., /home.html)
if (preg_match('#^/(.+)\.html$#', $path, $matches)) {
    $page = basename($matches[1]); // Prevent directory traversal
    $htmlFile = $docroot . '/jquery-frontend/' . $page . '.html';
    if (is_file($htmlFile)) {
        readfile($htmlFile);
        exit;
    }
}

// 4) Main entry point for the jQuery frontend
// Serve index.html for the root path or any other non-matched path
$indexPath = $docroot . '/jquery-frontend/index.html';
if (is_file($indexPath)) {
    readfile($indexPath);
    exit;
}

http_response_code(404);
echo "Not Found";
