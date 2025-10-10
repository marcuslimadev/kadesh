<?php
/**
 * Script de Verificação de Compatibilidade Laravel 12
 * Verifica se o servidor atende todos os requisitos
 */

echo "=== VERIFICAÇÃO DE COMPATIBILIDADE LARAVEL 12 ===\n\n";

// 1. Versão do PHP
echo "1. VERSÃO DO PHP:\n";
$phpVersion = phpversion();
echo "   Versão atual: {$phpVersion}\n";
echo "   Requisito: >= 8.2.0\n";
$phpOk = version_compare($phpVersion, '8.2.0', '>=');
echo "   Status: " . ($phpOk ? "✅ OK" : "❌ FALHOU") . "\n\n";

// 2. Extensões PHP necessárias
echo "2. EXTENSÕES PHP NECESSÁRIAS:\n";
$requiredExtensions = [
    'bcmath' => 'BCMath',
    'ctype' => 'Ctype',
    'curl' => 'cURL',
    'dom' => 'DOM',
    'fileinfo' => 'Fileinfo',
    'json' => 'JSON',
    'mbstring' => 'Mbstring',
    'openssl' => 'OpenSSL',
    'pcre' => 'PCRE',
    'pdo' => 'PDO',
    'tokenizer' => 'Tokenizer',
    'xml' => 'XML',
    'zip' => 'Zip'
];

$extensionsOk = true;
foreach ($requiredExtensions as $ext => $name) {
    $loaded = extension_loaded($ext);
    echo "   {$name}: " . ($loaded ? "✅ OK" : "❌ FALTANDO") . "\n";
    if (!$loaded) $extensionsOk = false;
}
echo "\n";

// 3. Configurações do PHP
echo "3. CONFIGURAÇÕES DO PHP:\n";
$memoryLimit = ini_get('memory_limit');
$maxExecutionTime = ini_get('max_execution_time');
$uploadMaxFilesize = ini_get('upload_max_filesize');
$postMaxSize = ini_get('post_max_size');

echo "   Memory Limit: {$memoryLimit} (recomendado: >= 128M)\n";
echo "   Max Execution Time: {$maxExecutionTime}s (recomendado: >= 60s)\n";
echo "   Upload Max Filesize: {$uploadMaxFilesize}\n";
echo "   Post Max Size: {$postMaxSize}\n\n";

// 4. Permissões de diretório
echo "4. PERMISSÕES DE DIRETÓRIO:\n";
$directories = [
    'storage' => __DIR__ . '/storage',
    'bootstrap/cache' => __DIR__ . '/bootstrap/cache',
];

$permissionsOk = true;
foreach ($directories as $name => $path) {
    $writable = is_writable($path);
    echo "   {$name}: " . ($writable ? "✅ GRAVÁVEL" : "❌ SEM PERMISSÃO") . "\n";
    if (!$writable) $permissionsOk = false;
}
echo "\n";

// 5. Composer
echo "5. COMPOSER:\n";
$composerExists = file_exists(__DIR__ . '/composer.json');
$vendorExists = file_exists(__DIR__ . '/vendor/autoload.php');
echo "   composer.json: " . ($composerExists ? "✅ OK" : "❌ FALTANDO") . "\n";
echo "   vendor/autoload.php: " . ($vendorExists ? "✅ OK" : "❌ FALTANDO") . "\n\n";

// 6. Arquivos essenciais do Laravel
echo "6. ARQUIVOS ESSENCIAIS DO LARAVEL:\n";
$laravelFiles = [
    'artisan' => __DIR__ . '/artisan',
    'bootstrap/app.php' => __DIR__ . '/bootstrap/app.php',
    '.env' => __DIR__ . '/.env',
];

$filesOk = true;
foreach ($laravelFiles as $name => $path) {
    $exists = file_exists($path);
    echo "   {$name}: " . ($exists ? "✅ OK" : "❌ FALTANDO") . "\n";
    if (!$exists) $filesOk = false;
}
echo "\n";

// 7. Configuração do .env
echo "7. CONFIGURAÇÃO DO .ENV:\n";
if (file_exists(__DIR__ . '/.env')) {
    $envContent = file_get_contents(__DIR__ . '/.env');
    $hasAppKey = strpos($envContent, 'APP_KEY=') !== false && strpos($envContent, 'APP_KEY=base64:') !== false;
    $hasDbConfig = strpos($envContent, 'DB_DATABASE=') !== false;
    
    echo "   APP_KEY configurada: " . ($hasAppKey ? "✅ OK" : "❌ FALTANDO") . "\n";
    echo "   DB_DATABASE configurada: " . ($hasDbConfig ? "✅ OK" : "❌ FALTANDO") . "\n";
    
    // Verificar se há problema no .env que pode causar o domain malformado
    if (strpos($envContent, 'DB_CHARSET=utf8mb4SESSION_DOMAIN=') !== false || 
        strpos($envContent, '.com.brDB_CHARSET=') !== false) {
        echo "   ❌ PROBLEMA DETECTADO: .env corrompido com concatenação de variáveis!\n";
        echo "      Isso pode causar domain malformado nos cookies!\n";
    }
} else {
    echo "   ❌ Arquivo .env não encontrado\n";
}
echo "\n";

// 8. Teste de middleware personalizado
echo "8. TESTE DE MIDDLEWARE:\n";
$middlewareFile = __DIR__ . '/app/Http/Middleware/FixSessionCookies.php';
$middlewareExists = file_exists($middlewareFile);
echo "   FixSessionCookies.php: " . ($middlewareExists ? "✅ OK" : "❌ FALTANDO") . "\n";

if ($middlewareExists) {
    $bootstrapApp = file_get_contents(__DIR__ . '/bootstrap/app.php');
    $middlewareRegistered = strpos($bootstrapApp, 'FixSessionCookies::class') !== false;
    echo "   Middleware registrado: " . ($middlewareRegistered ? "✅ OK" : "❌ NÃO REGISTRADO") . "\n";
}
echo "\n";

// 9. Teste básico do Laravel
echo "9. TESTE BÁSICO DO LARAVEL:\n";
try {
    // Tentar carregar o autoloader
    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
        require_once __DIR__ . '/vendor/autoload.php';
        echo "   Autoloader: ✅ OK\n";
        
        // Tentar criar uma instância básica da aplicação
        if (file_exists(__DIR__ . '/bootstrap/app.php')) {
            $app = require_once __DIR__ . '/bootstrap/app.php';
            echo "   Bootstrap App: ✅ OK\n";
        } else {
            echo "   Bootstrap App: ❌ FALHOU\n";
        }
    } else {
        echo "   Autoloader: ❌ FALTANDO\n";
    }
} catch (Exception $e) {
    echo "   Laravel Bootstrap: ❌ ERRO - " . $e->getMessage() . "\n";
}
echo "\n";

// RESUMO FINAL
echo "=== RESUMO FINAL ===\n";
$allOk = $phpOk && $extensionsOk && $permissionsOk && $filesOk;
echo "Status Geral: " . ($allOk ? "✅ SISTEMA COMPATÍVEL" : "❌ PROBLEMAS DETECTADOS") . "\n";

if (!$allOk) {
    echo "\nRECOMENDAÇÕES:\n";
    if (!$phpOk) echo "- Atualize o PHP para versão 8.2 ou superior\n";
    if (!$extensionsOk) echo "- Instale as extensões PHP faltantes\n";
    if (!$permissionsOk) echo "- Ajuste as permissões dos diretórios (chmod 755 ou 775)\n";
    if (!$filesOk) echo "- Execute 'composer install' para instalar dependências\n";
}

echo "\n=== FIM DA VERIFICAÇÃO ===\n";
?>