<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh;charset=utf8mb4', 'root', '');

echo "=== Criando tabela project_deliveries ===\n\n";

try {
    // Verificar se já existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'project_deliveries'");
    if ($stmt->fetch()) {
        echo "⚠️  Tabela já existe. Pulando criação.\n";
        exit;
    }
    
    $pdo->exec("
        CREATE TABLE project_deliveries (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            project_id BIGINT UNSIGNED NOT NULL,
            provider_id BIGINT UNSIGNED NOT NULL,
            contractor_id BIGINT UNSIGNED NOT NULL,
            
            -- Entrega
            delivered_at TIMESTAMP NULL,
            delivery_notes TEXT,
            delivery_files JSON,
            
            -- Aceite
            accepted_at TIMESTAMP NULL,
            accepted_by BIGINT UNSIGNED NULL,
            acceptance_notes TEXT,
            
            -- Revisão/Ajustes
            revision_requested BOOLEAN DEFAULT FALSE,
            revision_notes TEXT,
            revision_requested_at TIMESTAMP NULL,
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (accepted_by) REFERENCES users(id) ON DELETE SET NULL,
            
            INDEX idx_project (project_id),
            INDEX idx_provider (provider_id),
            INDEX idx_contractor (contractor_id),
            INDEX idx_accepted_at (accepted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    
    echo "✅ Tabela project_deliveries criada com sucesso!\n";
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
