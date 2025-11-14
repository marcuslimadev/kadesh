<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');

echo "VERIFICAÇÃO DE LEILÕES:\n";
echo "═══════════════════════════════════════\n\n";

// 1. Total de projetos open
$total = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'open'")->fetchColumn();
echo "📊 Total de projetos com status 'open': $total\n\n";

// 2. Listar todos os projetos open
$projects = $pdo->query("
    SELECT id, contractor_id, title, status, created_at 
    FROM projects 
    WHERE status = 'open' 
    ORDER BY created_at DESC
")->fetchAll(PDO::FETCH_ASSOC);

echo "PROJETOS OPEN:\n";
foreach ($projects as $p) {
    echo "  - #{$p['id']}: {$p['title']} (contractor_id: {$p['contractor_id']}) - {$p['status']}\n";
}

echo "\n";

// 3. Simular o que a API retorna
echo "SIMULANDO API /api/projects:\n";
echo "═══════════════════════════════════════\n";

$apiQuery = "
    SELECT p.*, u.name as user_name, 
    (SELECT COUNT(*) FROM bids WHERE project_id = p.id) as bids_count,
    (SELECT MIN(amount) FROM bids WHERE project_id = p.id) as lowest_bid
    FROM projects p 
    LEFT JOIN users u ON p.contractor_id = u.id 
    WHERE 1=1
    ORDER BY p.created_at DESC
";

$apiResult = $pdo->query($apiQuery)->fetchAll(PDO::FETCH_ASSOC);

echo "Retornou " . count($apiResult) . " projetos\n\n";

foreach ($apiResult as $proj) {
    echo "#{$proj['id']}: {$proj['title']}\n";
    echo "  - Status: {$proj['status']}\n";
    echo "  - Contractor: {$proj['user_name']} (ID {$proj['contractor_id']})\n";
    echo "  - Lances: {$proj['bids_count']}\n";
    echo "  - Menor lance: " . ($proj['lowest_bid'] ?? 'N/A') . "\n\n";
}
