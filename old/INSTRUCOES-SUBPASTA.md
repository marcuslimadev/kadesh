# KADESH - INSTRUÇÕES PARA SUBPASTA /kadesh/

## 📁 ESTRUTURA NO CPANEL

Extrair o ZIP na pasta: `public_html/kadesh/`

Resultado esperado:
```
public_html/
├── kadesh/                    ← Subpasta do sistema
    ├── .htaccess             ← Configurado para /kadesh/
    ├── index.html            ← Com base href="/kadesh/"
    ├── api/
    │   └── index.php         ← API configurada para subpasta
    ├── assets/               ← CSS, JS, imagens
    ├── config/               ← Configuração do banco
    ├── database.sql          ← Schema completo
    └── test-paths.html       ← Arquivo de teste
```

## 🌐 URLs DO SISTEMA

**URL Principal:** `https://kaddeshsolucoes.com.br/kadesh/`
**API Endpoints:** `https://kaddeshsolucoes.com.br/kadesh/api/*`
**Assets:** `https://kaddeshsolucoes.com.br/kadesh/assets/*`

## 🔧 CONFIGURAÇÃO

### 1. Configurar Banco de Dados
```bash
# No cPanel > MySQL Databases
1. Criar database: kaddeshsolucoes_kadesh
2. Criar usuário: kaddeshsolucoes_kadesh
3. Dar todas as permissões

# Importar schema
# No phpMyAdmin > Importar > database.sql
```

### 2. Configurar config/database.php
```php
<?php
return [
    'host' => 'localhost',
    'dbname' => 'kaddeshsolucoes_kadesh',
    'username' => 'kaddeshsolucoes_kadesh',
    'password' => 'SUA_SENHA_AQUI',
    'charset' => 'utf8mb4'
];
```

### 3. Testar Instalação
1. Acesse: `https://kaddeshsolucoes.com.br/kadesh/test-paths.html`
2. Clique nos botões de teste
3. Verifique se todos estão ✅ verdes

## ✅ VERIFICAÇÕES

### APIs devem responder:
- `/kadesh/api/health` → `{"status": "ok", "timestamp": "..."}`
- `/kadesh/api/auctions/active` → Lista de projetos

### Assets devem carregar:
- `/kadesh/assets/logo-Dx30nS6F.png` → Logo do sistema
- `/kadesh/assets/index-DpARuA9j.css` → CSS principal
- `/kadesh/favicon.svg` → Redirecionado para logo

### Sistema deve funcionar:
- `/kadesh/` → Página inicial
- `/kadesh/login` → Página de login
- `/kadesh/dashboard` → Dashboard (após login)

## 🚨 PROBLEMAS COMUNS

### 404 nas APIs
- Verificar se mod_rewrite está ativo no Apache
- Conferir se .htaccess está na pasta /kadesh/
- Verificar permissões da pasta api/

### 500 Internal Server Error
- Verificar config/database.php
- Conferir se banco de dados existe
- Verificar logs de erro do cPanel

### Assets não carregam
- Verificar se pasta assets/ foi extraída
- Conferir permissões de leitura
- Verificar se base href está correto no index.html

## 📞 SUPORTE

Se algo não funcionar:
1. Acesse primeiro o test-paths.html
2. Verifique os logs de erro no cPanel
3. Confirme as configurações do banco
4. Teste as URLs manualmente

---
Sistema configurado para rodar em: **https://kaddeshsolucoes.com.br/kadesh/**
Data: 13/11/2025