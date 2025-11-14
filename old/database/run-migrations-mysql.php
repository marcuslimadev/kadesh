<?php
/**
 * Script de Migração MySQL
 * Executa todas as migrações em ordem
 */

// Configuração do banco de dados
$host = 'localhost';
$dbname = 'kadesh';
$username = 'root';
$password = '';

try {
    // Conectar ao MySQL
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    echo "✓ Conectado ao banco de dados MySQL '$dbname'\n\n";
    
    // Criar tabela de controle de migrações se não existir
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS migrations (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL UNIQUE,
            batch INT NOT NULL,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    
    // Obter o próximo número de batch
    $stmt = $pdo->query("SELECT MAX(batch) as max_batch FROM migrations");
    $result = $stmt->fetch();
    $nextBatch = ($result['max_batch'] ?? 0) + 1;
    
    // Diretório das migrações
    $migrationsDir = __DIR__ . '/migrations_mysql';
    
    if (!is_dir($migrationsDir)) {
        die("❌ Diretório de migrações não encontrado: $migrationsDir\n");
    }
    
    // Obter todas as migrações já executadas
    $stmt = $pdo->query("SELECT migration FROM migrations");
    $executedMigrations = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Listar arquivos de migração em ordem
    $migrationFiles = glob($migrationsDir . '/*.sql');
    sort($migrationFiles);
    
    if (empty($migrationFiles)) {
        echo "⚠ Nenhuma migração encontrada em $migrationsDir\n";
        exit(0);
    }
    
    $executedCount = 0;
    $skippedCount = 0;
    
    echo "Iniciando migrações...\n";
    echo str_repeat('=', 80) . "\n\n";
    
    foreach ($migrationFiles as $file) {
        $migrationName = basename($file);
        
        // Verificar se já foi executada
        if (in_array($migrationName, $executedMigrations)) {
            echo "⊘ SKIP: $migrationName (já executada)\n";
            $skippedCount++;
            continue;
        }
        
        echo "→ Executando: $migrationName\n";
        
        try {
            // Ler o conteúdo do arquivo SQL
            $sql = file_get_contents($file);
            
            if (empty($sql)) {
                echo "  ⚠ Arquivo vazio, pulando...\n\n";
                continue;
            }
            
            // Remover comentários de linha (-- comentário)
            $sql = preg_replace('/--[^\n]*\n/', "\n", $sql);
            
            // Dividir por ponto e vírgula, mas manter SQL válido
            $statements = preg_split('/;\s*$/m', $sql);
            $statementCount = 0;
            
            foreach ($statements as $statement) {
                $statement = trim($statement);
                // Ignorar statements vazios ou apenas comentários
                if (!empty($statement) && !preg_match('/^\/\*.*\*\/$/s', $statement)) {
                    $pdo->exec($statement);
                    $statementCount++;
                }
            }
            
            // Registrar a migração
            $stmt = $pdo->prepare("INSERT INTO migrations (migration, batch) VALUES (?, ?)");
            $stmt->execute([$migrationName, $nextBatch]);
            
            echo "  ✓ Sucesso! ($statementCount statements executados)\n\n";
            $executedCount++;
            
        } catch (PDOException $e) {
            echo "  ❌ ERRO: " . $e->getMessage() . "\n\n";
            
            // Perguntar se deseja continuar
            echo "Deseja continuar com as próximas migrações? (s/n): ";
            $handle = fopen("php://stdin", "r");
            $line = fgets($handle);
            if (trim(strtolower($line)) != 's') {
                echo "\nMigrações interrompidas.\n";
                exit(1);
            }
            echo "\n";
            fclose($handle);
        }
    }
    
    echo str_repeat('=', 80) . "\n";
    echo "\n✓ Processo de migração concluído!\n";
    echo "  • Executadas: $executedCount\n";
    echo "  • Puladas: $skippedCount\n";
    echo "  • Total: " . count($migrationFiles) . "\n\n";
    
    // Listar tabelas criadas
    echo "Tabelas no banco de dados:\n";
    echo str_repeat('-', 80) . "\n";
    
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $columns = 3;
    $tableChunks = array_chunk($tables, ceil(count($tables) / $columns));
    
    $maxRows = max(array_map('count', $tableChunks));
    for ($i = 0; $i < $maxRows; $i++) {
        for ($j = 0; $j < $columns; $j++) {
            if (isset($tableChunks[$j][$i])) {
                echo str_pad($tableChunks[$j][$i], 30);
            }
        }
        echo "\n";
    }
    
    echo "\nTotal: " . count($tables) . " tabelas\n";
    
} catch (PDOException $e) {
    die("\n❌ Erro de conexão: " . $e->getMessage() . "\n");
}
