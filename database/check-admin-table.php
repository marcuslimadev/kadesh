<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');
$result = $pdo->query('DESCRIBE admin_users');
echo "Colunas da tabela admin_users:\n\n";
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}
