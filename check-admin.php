<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh;charset=utf8mb4', 'root', '');

echo "=== Verificando usuário admin ===\n\n";

$stmt = $pdo->query('SELECT id, email, user_type, name FROM users WHERE email = "admin@teste.com"');
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "✅ Usuário encontrado:\n";
    echo json_encode($user, JSON_PRETTY_PRINT);
} else {
    echo "❌ Usuário admin@teste.com NÃO encontrado\n";
    echo "\n=== Verificando tabela admin_users ===\n";
    
    try {
        $stmt = $pdo->query('SELECT id, email, name FROM admin_users WHERE email = "admin@teste.com"');
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin) {
            echo "✅ Admin encontrado na tabela admin_users:\n";
            echo json_encode($admin, JSON_PRETTY_PRINT);
        } else {
            echo "❌ Admin NÃO encontrado na tabela admin_users\n";
        }
    } catch (Exception $e) {
        echo "⚠️ Tabela admin_users não existe: " . $e->getMessage() . "\n";
    }
}

echo "\n\n=== Todos os usuários ===\n";
$stmt = $pdo->query('SELECT id, email, user_type, name FROM users LIMIT 5');
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users, JSON_PRETTY_PRINT);
