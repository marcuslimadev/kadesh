<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh;charset=utf8mb4', 'root', '');

echo "=== Verificando tabela system_settings ===\n\n";

try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'system_settings'");
    $exists = $stmt->fetch();
    
    if ($exists) {
        echo "✅ Tabela existe\n\n";
        echo "=== Registros ===\n";
        $stmt = $pdo->query("SELECT * FROM system_settings");
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($settings, JSON_PRETTY_PRINT);
    } else {
        echo "❌ Tabela NÃO existe\n";
        echo "\n=== Criando tabela ===\n";
        
        $pdo->exec("
            CREATE TABLE system_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                `key` VARCHAR(255) UNIQUE NOT NULL,
                `value` TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        echo "✅ Tabela criada\n\n";
        
        echo "=== Inserindo configurações padrão ===\n";
        
        $defaults = [
            'mp_environment' => 'test',
            'mp_public_key_test' => '',
            'mp_access_token_test' => '',
            'mp_public_key_prod' => '',
            'mp_access_token_prod' => '',
            'platform_fee_percentage' => '1.0',
            'site_name' => 'Kadesh',
            'site_email' => 'contato@kadesh.com.br',
            'site_phone' => '',
        ];
        
        foreach ($defaults as $key => $value) {
            $stmt = $pdo->prepare("INSERT INTO system_settings (`key`, `value`) VALUES (?, ?)");
            $stmt->execute([$key, $value]);
        }
        
        echo "✅ Configurações padrão inseridas\n";
    }
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
