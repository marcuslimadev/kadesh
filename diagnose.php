<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

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

// Boot the application first
$app->boot();

echo "\n=== CONFIG VALUES ===\n";
$sessionDomain = $app['config']->get('session.domain');
echo "session.domain: " . var_export($sessionDomain, true) . "\n";

$sessionCookie = $app['config']->get('session.cookie');
echo "session.cookie: " . var_export($sessionCookie, true) . "\n";

$dbCharset = $app['config']->get('database.connections.mysql.charset');
echo "database charset: " . var_export($dbCharset, true) . "\n";

echo "\n=== TESTING SetCookie STRING ===\n";
// Simula o que o Symfony faz para gerar o Set-Cookie header
$name = 'test-cookie';
$value = 'test-value';
$expire = time() + 3600;
$path = '/';
$domain = $sessionDomain;
$secure = true;
$httpOnly = true;
$sameSite = 'lax';

echo "Domain value being used: " . var_export($domain, true) . "\n";
echo "Database charset value: " . var_export($dbCharset, true) . "\n";

// Monta o cookie header manualmente como o Symfony faz
$cookie = $name . '=' . urlencode($value);
$cookie .= '; expires=' . gmdate('D, d M Y H:i:s T', $expire);
$cookie .= '; Max-Age=' . ($expire - time());
$cookie .= '; path=' . $path;
if ($domain !== null) {
    $cookie .= '; domain=' . $domain;
}
if ($secure) {
    $cookie .= '; secure';
}
if ($httpOnly) {
    $cookie .= '; httponly';
}
if ($sameSite) {
    $cookie .= '; samesite=' . $sameSite;
}

echo "\nGenerated Set-Cookie header:\n";
echo $cookie . "\n";
