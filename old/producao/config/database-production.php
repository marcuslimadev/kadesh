<?php
/**
 * Configuração do banco de dados para produção
 * IMPORTANTE: Configure estas informações com as credenciais reais do cPanel
 */

return [
    // Configurações de produção - AJUSTAR CONFORME CPANEL
    'host' => 'localhost',
    'dbname' => 'kaddeshsolucoes_kadesh', // Geralmente: seuusuario_nomedobanco
    'username' => 'kaddeshsolucoes_kadesh', // Seu usuário do banco no cPanel
    'password' => '', // SUA SENHA DO BANCO AQUI - não commitear!
    'charset' => 'utf8mb4',
    
    // Configurações de conexão
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 30
    ]
];

/*
 * INSTRUÇÕES PARA CONFIGURAÇÃO:
 * 
 * 1. Acesse o cPanel da Hostinger
 * 2. Vá em "Bancos de Dados MySQL"
 * 3. Anote o nome do banco (ex: kaddeshsolucoes_kadesh)
 * 4. Anote o usuário (ex: kaddeshsolucoes_user)
 * 5. Use a senha que você definiu
 * 6. Atualize este arquivo com as credenciais corretas
 * 
 * IMPORTANTE: Não commite senhas reais no Git!
 */