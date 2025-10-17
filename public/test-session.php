<?php
session_start();

echo "=== TESTE DE SESSÃO ===\n\n";
echo "Session ID: " . session_id() . "\n";
echo "Session save path: " . session_save_path() . "\n";
echo "Session name: " . session_name() . "\n\n";

echo "=== CONTEÚDO DA SESSÃO ===\n";
echo json_encode($_SESSION, JSON_PRETTY_PRINT);
echo "\n\n";

echo "=== COOKIES ===\n";
echo json_encode($_COOKIE, JSON_PRETTY_PRINT);
