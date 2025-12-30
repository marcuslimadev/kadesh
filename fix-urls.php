<?php
// Script para corrigir URLs nos arquivos JS

$dir = '/home/u912059534/domains/darkorchid-ferret-999896.hostingersite.com/public_html/assets';
$oldUrl = 'https://seudominio.com.br/api/api';
$newUrl = 'https://darkorchid-ferret-999896.hostingersite.com/api';

$count = 0;
$files = glob($dir . '/*.js');

foreach ($files as $file) {
    $content = file_get_contents($file);
    if (strpos($content, $oldUrl) !== false) {
        $newContent = str_replace($oldUrl, $newUrl, $content);
        file_put_contents($file, $newContent);
        echo "Fixed: " . basename($file) . "\n";
        $count++;
    }
}

echo "\nTotal fixed: $count files\n";
