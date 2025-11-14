<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');

echo "PROJETOS POR CONTRATANTE:\n";
echo "═══════════════════════════════════════\n\n";

$contractors = [17 => 'Julio', 42 => 'João'];

foreach ($contractors as $id => $name) {
    $projects = $pdo->prepare('SELECT id, title, status, created_at FROM projects WHERE contractor_id = ? ORDER BY created_at DESC');
    $projects->execute([$id]);
    $results = $projects->fetchAll(PDO::FETCH_ASSOC);
    
    echo "[$name - ID $id]: " . count($results) . " projeto(s)\n";
    foreach ($results as $p) {
        echo "  - #{$p['id']}: {$p['title']} ({$p['status']})\n";
    }
    echo "\n";
}
