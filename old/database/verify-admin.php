<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');

echo "VERIFICANDO USUÁRIO ADMIN:\n";
echo "═══════════════════════════════════════\n\n";

// Buscar usuário
$user = $pdo->query("SELECT id, name, email, password, user_type FROM users WHERE email = 'admin@teste.com'")->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "✅ Usuário encontrado:\n";
    echo "  ID: {$user['id']}\n";
    echo "  Nome: {$user['name']}\n";
    echo "  Email: {$user['email']}\n";
    echo "  Tipo: {$user['user_type']}\n";
    echo "  Hash: " . substr($user['password'], 0, 50) . "...\n\n";
    
    // Testar senha
    $senha = 'Teste@123';
    $verifica = password_verify($senha, $user['password']);
    
    echo "🔐 Teste de senha 'Teste@123':\n";
    if ($verifica) {
        echo "  ✅ Senha CORRETA!\n";
    } else {
        echo "  ❌ Senha INCORRETA!\n\n";
        
        // Vamos criar um novo hash
        echo "📝 Gerando novo hash...\n";
        $novoHash = password_hash($senha, PASSWORD_DEFAULT);
        
        $pdo->exec("UPDATE users SET password = '$novoHash' WHERE email = 'admin@teste.com'");
        
        echo "✅ Senha atualizada!\n";
        echo "Tente fazer login novamente.\n";
    }
} else {
    echo "❌ Usuário não encontrado!\n";
}
