<?php
// Teste simples de conexão com banco
try {
    $pdo = new PDO('mysql:host=localhost;dbname=kadesh;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "✅ Conexão com banco OK\n";
    
    // Verificar se usuário admin existe
    $stmt = $pdo->prepare('SELECT id, email, user_type FROM users WHERE email = ?');
    $stmt->execute(['admin@kadesh.com']);
    $admin = $stmt->fetch();
    
    if ($admin) {
        echo "✅ Admin encontrado: " . json_encode($admin) . "\n";
    } else {
        echo "❌ Admin não encontrado\n";
        
        // Listar alguns usuários
        $stmt = $pdo->query('SELECT id, email, user_type FROM users LIMIT 5');
        $users = $stmt->fetchAll();
        echo "📋 Usuários existentes: " . json_encode($users) . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
}
?>