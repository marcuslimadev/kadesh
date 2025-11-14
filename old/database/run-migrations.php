<?php
/**
 * Script de Execução de Migrações
 * Executa todas as migrações SQL pendentes no banco de dados
 */

$dbPath = __DIR__ . '/kadesh.sqlite';
$migrationsPath = __DIR__ . '/migrations/';

// Criar conexão com o banco
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Conectado ao banco de dados: $dbPath\n\n";
    
    // Criar tabela de controle de migrações se não existir
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            migration TEXT NOT NULL UNIQUE,
            executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
    
    // Obter migrações já executadas
    $stmt = $pdo->query("SELECT migration FROM migrations");
    $executedMigrations = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Obter todos os arquivos de migração
    $migrationFiles = glob($migrationsPath . '*.sql');
    sort($migrationFiles);
    
    $executedCount = 0;
    $skippedCount = 0;
    
    foreach ($migrationFiles as $file) {
        $migrationName = basename($file);
        
        // Verificar se já foi executada
        if (in_array($migrationName, $executedMigrations)) {
            echo "⏭️  PULANDO: $migrationName (já executada)\n";
            $skippedCount++;
            continue;
        }
        
        echo "▶️  EXECUTANDO: $migrationName\n";
        
        // Ler e executar o SQL
        $sql = file_get_contents($file);
        
        try {
            $pdo->exec("BEGIN TRANSACTION");
            $pdo->exec($sql);
            
            // Registrar migração como executada
            $stmt = $pdo->prepare("INSERT INTO migrations (migration) VALUES (?)");
            $stmt->execute([$migrationName]);
            
            $pdo->exec("COMMIT");
            
            echo "✅ SUCESSO: $migrationName\n\n";
            $executedCount++;
            
        } catch (Exception $e) {
            $pdo->exec("ROLLBACK");
            echo "❌ ERRO: $migrationName\n";
            echo "   Mensagem: " . $e->getMessage() . "\n\n";
            
            // Parar em caso de erro
            exit(1);
        }
    }
    
    echo "\n";
    echo "═══════════════════════════════════════\n";
    echo "RESUMO DAS MIGRAÇÕES\n";
    echo "═══════════════════════════════════════\n";
    echo "✅ Executadas: $executedCount\n";
    echo "⏭️  Puladas: $skippedCount\n";
    echo "📁 Total: " . count($migrationFiles) . "\n";
    echo "═══════════════════════════════════════\n\n";
    
    if ($executedCount > 0) {
        echo "🎉 Banco de dados atualizado com sucesso!\n";
    } else {
        echo "ℹ️  Nenhuma migração nova para executar.\n";
    }
    
} catch (Exception $e) {
    echo "❌ ERRO DE CONEXÃO: " . $e->getMessage() . "\n";
    exit(1);
}
