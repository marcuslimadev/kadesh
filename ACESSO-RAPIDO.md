# 🚀 GUIA RÁPIDO DE ACESSO - KADESH

## 📋 CREDENCIAIS DE ACESSO

### 👤 ADMINISTRADORES

#### Admin Principal (Produção)
```
URL: http://localhost/kadesh/login
Email: admin@kadesh.com
Senha: Kadesh@2025
```

#### Admin de Teste (Desenvolvimento) ✅ SENHA CORRIGIDA
```
URL: http://localhost/kadesh/login
Email: admin@teste.com
Senha: Teste@123
Hash: $2y$10$KdUmRMOXmqQl92FPcIy0iOmNoHmk84AxfSTpE1AkCTaUIsaxq.chC
```

---

## 🔗 URLS PRINCIPAIS

### Frontend (Usuários)
```
Home:                    http://localhost/kadesh/
Login:                   http://localhost/kadesh/login
Registro:                http://localhost/kadesh/register
Projetos:                http://localhost/kadesh/projects
Criar Projeto:           http://localhost/kadesh/projects/create
Perfil Fornecedor:       http://localhost/kadesh/provider/profile
Portfólio Fornecedor:    http://localhost/kadesh/provider/portfolio
```

### Backend (Admin)
```
Login Admin:             http://localhost/kadesh/admin/login
Dashboard Admin:         http://localhost/kadesh/admin/dashboard
Configurações:           http://localhost/kadesh/admin/settings
```

### API Endpoints (Teste com Postman/Insomnia)
```
Health Check:            GET  http://localhost/kadesh/api/health
Registro:                POST http://localhost/kadesh/api/register
Login:                   POST http://localhost/kadesh/api/login
Usuário Atual:           GET  http://localhost/kadesh/api/user
Projetos:                GET  http://localhost/kadesh/api/projects
Criar Projeto:           POST http://localhost/kadesh/api/projects
Perfil Fornecedor:       GET  http://localhost/kadesh/api/providers/1/profile
Admin Stats:             GET  http://localhost/kadesh/api/admin/stats
Admin Settings:          GET  http://localhost/kadesh/api/admin/settings
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### 1️⃣ Banco de Dados
```sql
-- Verificar tabelas criadas
SHOW TABLES FROM kadesh;

-- Verificar administradores
SELECT id, name, email, is_super_admin FROM admin_users;

-- Verificar configurações
SELECT setting_key, setting_category FROM system_settings;

-- Verificar usuários
SELECT id, name, email, user_type FROM users LIMIT 5;
```

### 2️⃣ Arquivos Backend
```
✅ backend.php
✅ backend-provider.php
✅ backend-reviews.php
✅ backend-admin.php
✅ MercadoPago.php
✅ .env.mp
```

### 3️⃣ Componentes Frontend
```
✅ ProviderProfile.vue
✅ ProviderPortfolio.vue
✅ ProviderPublicView.vue
✅ ReviewForm.vue
✅ PaymentCheckout.vue
✅ AdminLogin.vue
✅ AdminDashboard.vue
✅ AdminSettings.vue
```

### 4️⃣ Pastas de Upload
```
✅ storage/uploads/portfolio/
✅ storage/uploads/reviews/
```

---

## 🧪 TESTES RÁPIDOS

### Teste 1: Health Check da API
```bash
curl http://localhost/kadesh/api/health
# Esperado: {"status":"ok","time":"2025-10-17T...","app":"kadesh-backend-php","php":"8.2.x"}
```

### Teste 2: Login Admin
```bash
curl -X POST http://localhost/kadesh/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teste.com","password":"Teste@123"}'
# Esperado: {"message":"Login realizado com sucesso","admin":{...}}
```

### Teste 3: Estatísticas (após login)
```bash
# Abrir navegador em modo anônimo
# Acessar: http://localhost/kadesh/admin/login
# Fazer login com admin@teste.com / Teste@123
# Acessar: http://localhost/kadesh/admin/dashboard
# Verificar se estatísticas carregam
```

### Teste 4: Criar Usuário Fornecedor
```bash
# Abrir: http://localhost/kadesh/register
# Preencher:
# - Nome: Teste Fornecedor
# - Email: fornecedor@teste.com
# - Senha: Teste@123
# - Tipo: Prestador
# Clicar em "Criar Conta"
```

### Teste 5: Preencher Perfil
```bash
# Login como fornecedor@teste.com
# Acessar: http://localhost/kadesh/provider/profile
# Preencher informações
# Salvar
# Verificar mensagem de sucesso
```

### Teste 6: Upload de Portfólio
```bash
# Acessar: http://localhost/kadesh/provider/portfolio
# Selecionar imagem (JPG/PNG)
# Adicionar título e descrição
# Upload
# Verificar se imagem aparece na galeria
```

### Teste 7: Ver Perfil Público
```bash
# Abrir nova aba anônima
# Acessar: http://localhost/kadesh/providers/1
# Verificar se perfil, portfólio e avaliações aparecem
```

---

## 🔧 CONFIGURAÇÃO INICIAL OBRIGATÓRIA

### Passo 1: Login no Admin
```
1. Acessar: http://localhost/kadesh/admin/login
2. Email: admin@teste.com
3. Senha: Teste@123
4. Clicar "Entrar"
```

### Passo 2: Configurar Mercado Pago
```
1. Acessar: http://localhost/kadesh/admin/settings
2. Obter credenciais em: https://www.mercadopago.com.br/developers/panel/app
3. Preencher:
   - Public Key (TEST): TEST-xxxxx-xxxx-xxxx-xxxx-xxxxx
   - Access Token (TEST): TEST-xxxxxxxxxxxx-xxxxxxxxxxxx
   - Ambiente: Teste
   - Taxa da Plataforma: 10%
4. Clicar "Salvar Configurações"
5. Verificar mensagem: "✅ Configurações salvas com sucesso!"
```

### Passo 3: Criar Usuário de Teste
```
1. Abrir aba anônima
2. Acessar: http://localhost/kadesh/register
3. Criar:
   - Contratante: contratante@teste.com / Teste@123
   - Fornecedor: fornecedor@teste.com / Teste@123
4. Fazer login com cada um para testar
```

---

## 🎯 FLUXO COMPLETO DE TESTE

### Cenário: Projeto do Início ao Fim

#### 1️⃣ Contratante cria projeto
```
Login: contratante@teste.com / Teste@123
Acessar: /projects/create
Título: "Reforma da Sala"
Descrição: "Pintura e instalação elétrica"
Categoria: Reforma
Orçamento: R$ 5.000
Clicar "Publicar Projeto"
```

#### 2️⃣ Fornecedor faz proposta
```
Login: fornecedor@teste.com / Teste@123
Acessar: /projects
Clicar no projeto "Reforma da Sala"
Proposta: R$ 4.500
Prazo: 10 dias
Descrição: "Experiência de 15 anos..."
Clicar "Enviar Proposta"
```

#### 3️⃣ Contratante aceita proposta
```
Login: contratante@teste.com
Acessar projeto
Ver proposta do fornecedor
Clicar "Aceitar Proposta"
Confirmar
```

#### 4️⃣ Pagamento (Sandbox)
```
Clicar "Ir para Pagamento"
Sistema cria preferência MP
Redireciona para Mercado Pago
[Em teste, use cartões de teste do MP]
Número: 5031 4332 1540 6351
Nome: APRO
CVV: 123
Validade: 11/25
```

#### 5️⃣ Fornecedor completa trabalho
```
Login: fornecedor@teste.com
Acessar projeto
Clicar "Marcar como Completo"
```

#### 6️⃣ Contratante avalia
```
Login: contratante@teste.com
Acessar projeto
Clicar "Avaliar Fornecedor"
Avaliação geral: 5 estrelas
Qualidade: 5
Comunicação: 5
Prazo: 5
Comentário: "Excelente trabalho!"
✓ Contrataria novamente
Enviar Avaliação
```

#### 7️⃣ Verificar estatísticas
```
Login Admin: admin@teste.com
Dashboard atualizado automaticamente
Ver receita da plataforma
Ver avaliação do fornecedor
```

---

## 📊 MONITORAMENTO

### Logs a Verificar
```bash
# Logs do Apache/XAMPP
c:\xampp\apache\logs\error.log

# Verificar se não há erros PHP
# Buscar por "kadesh" ou "backend.php"
```

### Banco de Dados
```sql
-- Verificar últimos projetos
SELECT * FROM projects ORDER BY created_at DESC LIMIT 5;

-- Verificar últimas propostas
SELECT * FROM bids ORDER BY created_at DESC LIMIT 5;

-- Verificar pagamentos
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;

-- Verificar avaliações
SELECT * FROM reviews ORDER BY created_at DESC LIMIT 5;

-- Verificar uploads
SELECT * FROM provider_portfolio ORDER BY created_at DESC LIMIT 10;
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Endpoint not found"
```
Verificar:
1. Arquivo backend.php inclui outros arquivos?
   require_once __DIR__ . '/backend-admin.php';
2. Apache reiniciado?
3. .htaccess configurado corretamente?
```

### Erro: "Unauthenticated"
```
1. Limpar cookies do navegador
2. Fazer logout e login novamente
3. Verificar sessão PHP ativa
```

### Erro ao upload de imagens
```
1. Verificar permissões:
   - storage/uploads/portfolio/
   - storage/uploads/reviews/
2. Verificar php.ini:
   - upload_max_filesize = 10M
   - post_max_size = 10M
3. Reiniciar Apache
```

### Admin não loga
```sql
-- Verificar se admin existe
SELECT * FROM admin_users WHERE email = 'admin@teste.com';

-- Recriar se necessário
DELETE FROM admin_users WHERE email = 'admin@teste.com';
-- Executar create-admin-teste.sql novamente
```

---

## 📞 SUPORTE

### Documentação Completa
```
Arquivo: SISTEMA-COMPLETO.md
Contém: Todos os detalhes técnicos, endpoints, tabelas, etc.
```

### Estrutura de Arquivos
```
c:\xampp\htdocs\kadesh\
├── backend.php                 (Router principal)
├── backend-provider.php        (Perfis e portfólio)
├── backend-reviews.php         (Avaliações)
├── backend-admin.php          (Painel admin)
├── MercadoPago.php            (Helper MP)
├── .env.mp                    (Configurações MP)
├── SISTEMA-COMPLETO.md        (Documentação)
├── ACESSO-RAPIDO.md          (Este arquivo)
└── frontend/src/views/       (Componentes Vue)
```

---

## ✅ SISTEMA PRONTO!

**Credenciais:**
- Admin Teste: `admin@teste.com` / `Teste@123`
- Admin Produção: `admin@kadesh.com` / `Kadesh@2025`

**Primeiro Passo:**
1. Login no admin
2. Configurar Mercado Pago
3. Criar usuários de teste
4. Começar a usar!

🎉 **Boa sorte com o projeto Kadesh!**
