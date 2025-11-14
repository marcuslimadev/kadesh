<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');
$users = $pdo->query('SELECT id, name, email, user_type FROM users WHERE user_type = "contractor" ORDER BY id')->fetchAll(PDO::FETCH_ASSOC);

echo "USUÁRIOS CONTRATANTES:\n";
echo "═══════════════════════════════════════\n";
foreach($users as $u) {
    echo "ID {$u['id']}: {$u['name']} ({$u['email']})\n";
}
