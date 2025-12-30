<?php
// Corrigir URLs em TODOS os arquivos JS

$dir = '/home/u912059534/domains/darkorchid-ferret-999896.hostingersite.com/public_html/assets';
$patterns = [
    'https://seudominio.com.br/api/api' => 'https://darkorchid-ferret-999896.hostingersite.com/api',
    'https://seudominio.com.br/api' => 'https://darkorchid-ferret-999896.hostingersite.com/api',
    'https://seudominio.com.br' => 'https://darkorchid-ferret-999896.hostingersite.com'
];

$count = 0;
$files = glob($dir . '/*.js');

foreach ($files as $file) {
    $content = file_get_contents($file);
    $originalContent = $content;
    
    foreach ($patterns as $old => $new) {
        $content = str_replace($old, $new, $content);
    }
    
    if ($content !== $originalContent) {
        file_put_contents($file, $content);
        echo "Fixed: " . basename($file) . "\n";
        $count++;
    }
}

echo "\nTotal fixed: $count files\n";
