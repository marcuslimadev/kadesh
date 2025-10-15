<?php
// Kadesh - Diagnóstico de Erro 500
// Este arquivo ajuda a identificar problemas no servidor

error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kadesh - Diagnóstico</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .box { background: white; padding: 20px; margin: 10px 0; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .ok { color: green; }
        .error { color: red; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        pre { background: #f8f8f8; padding: 10px; border-radius: 3px; overflow-x: auto; }
        code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🔍 Kadesh - Diagnóstico do Servidor</h1>
    
    <div class="box">
        <h2>✅ PHP Básico</h2>
        <p class="ok"><strong>PHP está funcionando!</strong></p>
        <p>Versão do PHP: <code><?php echo PHP_VERSION; ?></code></p>
        <p>Sistema Operacional: <code><?php echo PHP_OS; ?></code></p>
        <p>Server API: <code><?php echo php_sapi_name(); ?></code></p>
    </div>

    <div class="box">
        <h2>📂 Arquivos e Diretórios</h2>
        <?php
        $docroot = __DIR__;
        echo "<p>Document Root: <code>{$docroot}</code></p>";
        
        $files = ['backend.php', 'index.html', '.htaccess'];
        foreach ($files as $file) {
            $path = $docroot . '/' . $file;
            $exists = file_exists($path);
            $readable = $exists ? is_readable($path) : false;
            $class = $exists ? 'ok' : 'error';
            $status = $exists ? '✓ Existe' : '✗ Não encontrado';
            echo "<p class='{$class}'><strong>{$file}:</strong> {$status}";
            if ($exists) {
                echo " | Tamanho: " . filesize($path) . " bytes";
                echo " | Permissão: " . substr(sprintf('%o', fileperms($path)), -4);
            }
            echo "</p>";
        }
        ?>
    </div>

    <div class="box">
        <h2>🔌 Extensões PHP</h2>
        <?php
        $required = ['mysqli', 'pdo', 'pdo_mysql', 'json', 'session'];
        foreach ($required as $ext) {
            $loaded = extension_loaded($ext);
            $class = $loaded ? 'ok' : 'error';
            $status = $loaded ? '✓ Carregada' : '✗ Não carregada';
            echo "<p class='{$class}'><strong>{$ext}:</strong> {$status}</p>";
        }
        ?>
    </div>

    <div class="box">
        <h2>🌐 Informações da Requisição</h2>
        <pre><?php
        echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'N/A') . "\n";
        echo "SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? 'N/A') . "\n";
        echo "DOCUMENT_ROOT: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "\n";
        echo "SERVER_SOFTWARE: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'N/A') . "\n";
        echo "HTTP_HOST: " . ($_SERVER['HTTP_HOST'] ?? 'N/A') . "\n";
        ?></pre>
    </div>

    <div class="box">
        <h2>🔧 Teste do Backend</h2>
        <?php
        $backendFile = $docroot . '/backend.php';
        if (file_exists($backendFile)) {
            echo "<p class='ok'>✓ backend.php encontrado</p>";
            
            // Tentar verificar erros de sintaxe
            $output = [];
            $return = 0;
            exec("php -l " . escapeshellarg($backendFile) . " 2>&1", $output, $return);
            
            if ($return === 0) {
                echo "<p class='ok'>✓ Sintaxe do backend.php válida</p>";
            } else {
                echo "<p class='error'>✗ Erro de sintaxe no backend.php:</p>";
                echo "<pre>" . htmlspecialchars(implode("\n", $output)) . "</pre>";
            }
        } else {
            echo "<p class='error'>✗ backend.php não encontrado</p>";
        }
        ?>
    </div>

    <div class="box">
        <h2>🗄️ Teste de Conexão MySQL</h2>
        <?php
        try {
            $pdo = new PDO(
                'mysql:host=127.0.0.1;dbname=mmbsites_kadesh;charset=utf8mb4',
                'mmbsites_kadesh',
                'kadesh@2025',
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
            echo "<p class='ok'>✓ Conexão com MySQL estabelecida</p>";
            
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "<p>Total de usuários: <strong>{$result['total']}</strong></p>";
            
        } catch (PDOException $e) {
            echo "<p class='error'>✗ Erro ao conectar ao MySQL:</p>";
            echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
        }
        ?>
    </div>

    <div class="box">
        <h2>⚙️ Configurações PHP Importantes</h2>
        <pre><?php
        echo "memory_limit: " . ini_get('memory_limit') . "\n";
        echo "max_execution_time: " . ini_get('max_execution_time') . "\n";
        echo "post_max_size: " . ini_get('post_max_size') . "\n";
        echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
        echo "error_reporting: " . ini_get('error_reporting') . "\n";
        echo "display_errors: " . ini_get('display_errors') . "\n";
        ?></pre>
    </div>

    <div class="box">
        <h2>📝 Teste de Endpoints</h2>
        <p><a href="/api/health" target="_blank">Testar /api/health</a></p>
        <p><a href="/api/projects" target="_blank">Testar /api/projects</a></p>
        <p><a href="/" target="_blank">Voltar para raiz</a></p>
    </div>

    <hr style="margin: 40px 0;">
    <p style="text-align: center; color: #999;">
        Gerado em: <?php echo date('Y-m-d H:i:s'); ?> | 
        <a href="?phpinfo=1">Ver phpinfo()</a>
    </p>

    <?php
    if (isset($_GET['phpinfo'])) {
        echo '<div class="box">';
        phpinfo();
        echo '</div>';
    }
    ?>
</body>
</html>
