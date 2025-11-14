<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');

echo "=== TABELA PROJECTS ===\n";
$result = $pdo->query('DESCRIBE projects');
foreach($result as $row) {
    echo $row['Field'] . "\n";
}

echo "\n=== TABELA USERS ===\n";
$result = $pdo->query('DESCRIBE users');
foreach($result as $row) {
    echo $row['Field'] . "\n";
}

echo "\n=== TABELA BIDS ===\n";
$result = $pdo->query('DESCRIBE bids');
foreach($result as $row) {
    echo $row['Field'] . "\n";
}
