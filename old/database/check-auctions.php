<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');
$total = $pdo->query('SELECT COUNT(*) FROM project_auction_config')->fetchColumn();
echo "Total project_auction_config: $total\n";

$auctions = $pdo->query('SELECT id, project_id, status, ends_at FROM project_auction_config LIMIT 10')->fetchAll(PDO::FETCH_ASSOC);
echo "\nPrimeiros 10:\n";
foreach($auctions as $a) {
    echo "  - Auction #{$a['id']}: project_id={$a['project_id']}, status={$a['status']}, ends_at={$a['ends_at']}\n";
}
