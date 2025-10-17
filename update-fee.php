<?php
$pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');
$stmt = $pdo->prepare("UPDATE system_settings SET setting_value = '1.0' WHERE setting_key = 'platform_fee_percentage'");
$stmt->execute();
echo "✅ Taxa atualizada para 1%\n";
