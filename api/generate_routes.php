<?php
// Este script é apenas um utilitário para criar os esqueletos dos arquivos de API restantes
$modules = [
    'bids' => ['index.php', 'create.php', 'update.php', 'delete.php'],
    'wallet' => ['index.php', 'transactions.php', 'deposit.php', 'withdraw.php'],
    'payments' => ['index.php', 'mercadopago.php', 'webhook.php'],
    'notifications' => ['index.php', 'read.php'],
    'admin' => ['dashboard.php', 'users.php', 'projects.php', 'payments.php'],
    'contracts' => ['index.php', 'detail.php', 'update.php'],
    'reviews' => ['index.php', 'create.php'],
    'milestones' => ['index.php', 'create.php', 'update.php'],
    'messages' => ['index.php', 'send.php'],
    'receipts' => ['index.php'],
    'advertisements' => ['index.php', 'create.php']
];

$baseDir = __DIR__ . '/api';

foreach ($modules as $module => $files) {
    $dir = "$baseDir/$module";
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    
    foreach ($files as $file) {
        $path = "$dir/$file";
        if (!file_exists($path)) {
            $content = "<?php\nrequire_once __DIR__ . '/../../config/database.php';\nrequire_once __DIR__ . '/../../utils/helpers.php';\nrequire_once __DIR__ . '/../../middleware/auth.php';\n\n// Implementação para $module/$file\nHelpers::jsonResponse(['message' => 'Endpoint $module/$file em desenvolvimento']);\n";
            file_put_contents($path, $content);
        }
    }
}

echo "Esqueletos de rotas gerados com sucesso!\n";
