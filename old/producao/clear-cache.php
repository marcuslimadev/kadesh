<?php
// Limpa o OpCache
if (function_exists('opcache_reset')) {
    opcache_reset();
    echo "OpCache limpo com sucesso!<br>";
} else {
    echo "OpCache não está habilitado<br>";
}

// Limpa sessões antigas
session_start();
session_destroy();
echo "Sessão destruída!<br>";

// Força limpeza de realpath cache
clearstatcache(true);
echo "Stat cache limpo!<br>";

echo "<br><strong>Cache do servidor completamente limpo!</strong><br>";
echo "<a href='/kadesh/'>Voltar para o site</a>";
