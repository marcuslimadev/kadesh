<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');
$result = $pdo->query('DESCRIBE projects');
echo "Colunas da tabela projects:\n\n";
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}
