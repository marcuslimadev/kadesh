<?php
// Script para adicionar require do env.php em todos os endpoints

$baseDir = __DIR__;
$apiDir = $baseDir . '/api';

function addEnvRequire($file, $relativePath) {
    $content = file_get_contents($file);
    
    // Se já tem o require, pula
    if (strpos($content, 'config/env.php') !== false) {
        return false;
    }
    
    // Encontra a tag <?php e adiciona o require logo após
    $newContent = preg_replace(
        '/^<\?php\s*/m',
        "<?php\nrequire_once __DIR__ . '$relativePath/config/env.php';\n",
        $content,
        1
    );
    
    if ($newContent !== $content) {
        file_put_contents($file, $newContent);
        return true;
    }
    return false;
}

// Percorre todos os subdiretórios de api/
$directories = [
    'admin' => '/../..',
    'auth' => '/../..',
    'bids' => '/../..',
    'contracts' => '/../..',
    'messages' => '/../..',
    'milestones' => '/../..',
    'notifications' => '/../..',
    'payments' => '/../..',
    'projects' => '/../..',
    'receipts' => '/../..',
    'reviews' => '/../..',
    'users' => '/../..',
    'wallet' => '/../..',
    'advertisements' => '/../..'
];

$count = 0;
foreach ($directories as $dir => $relativePath) {
    $path = $apiDir . '/' . $dir;
    if (!is_dir($path)) continue;
    
    $files = glob($path . '/*.php');
    foreach ($files as $file) {
        if (addEnvRequire($file, $relativePath)) {
            echo "Updated: $file\n";
            $count++;
        }
    }
}

echo "\nTotal updated: $count files\n";
