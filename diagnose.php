<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

echo "=== ENV DIAGNOSTICS ===\n\n";

echo "env('SESSION_DOMAIN'): ";
var_dump(env('SESSION_DOMAIN'));

echo "\ngetenv('SESSION_DOMAIN'): ";
var_dump(getenv('SESSION_DOMAIN'));

echo "\n\$_ENV['SESSION_DOMAIN']: ";
var_dump($_ENV['SESSION_DOMAIN'] ?? 'NOT SET');

echo "\n\$_SERVER['SESSION_DOMAIN']: ";
var_dump($_SERVER['SESSION_DOMAIN'] ?? 'NOT SET');

echo "\n\nenv('DB_CHARSET'): ";
var_dump(env('DB_CHARSET'));

echo "\n\n=== RAW .env FILE ===\n";
$envContent = file_get_contents(__DIR__.'/.env');
$lines = explode("\n", $envContent);
foreach ($lines as $i => $line) {
    if (stripos($line, 'SESSION_DOMAIN') !== false || stripos($line, 'DB_CHARSET') !== false) {
        echo "Line " . ($i + 1) . ": " . json_encode($line) . "\n";
        echo "Hex: " . bin2hex($line) . "\n\n";
    }
}

echo "\n=== CONFIG VALUES ===\n";
echo "config('session.domain'): ";
var_dump(config('session.domain'));
