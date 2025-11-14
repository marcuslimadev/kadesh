# ✅ CHECKLIST DE DEPLOY - KADESH

## 📦 PRÉ-DEPLOY (No seu PC)

### 1. Build
- [ ] Executar `npm run build`
- [ ] Verificar `public/build/` criado
- [ ] Verificar tamanho dos arquivos JS/CSS

### 2. Git
- [ ] Commit todas as alterações
- [ ] Push para branch `producao`
- [ ] Verificar GitHub se recebeu push

### 3. Configuração
- [ ] Verificar credenciais do banco em `backend.php`
- [ ] Verificar base path em `vite.config.js`
- [ ] Verificar `.htaccess` configurado

---

## 🖥️ CPANEL - PRIMEIRA VEZ

### 1. Banco de Dados
- [ ] Criar banco: `mmbsites_kadesh`
- [ ] Criar usuário: `mmbsites_kadesh`
- [ ] Senha forte (anotar!)
- [ ] Adicionar usuário ao banco (ALL PRIVILEGES)

### 2. Git
- [ ] Ir em "Git Version Control"
- [ ] Criar repositório
- [ ] Clone URL: `https://github.com/marcuslimadev/kadesh.git`
- [ ] Branch: `producao`
- [ ] Aguardar clone (pode demorar)

### 3. Importar Banco
- [ ] phpMyAdmin → Selecionar banco
- [ ] Import → Escolher arquivo SQL
- [ ] Aguardar importação

### 4. Domínio
- [ ] Criar subdomínio: `kadesh.mmbsites.com.br`
- [ ] Document Root: `/home/mmbsites/kadesh/public`
- [ ] Salvar

### 5. Permissões
- [ ] Terminal: `chmod -R 755 /home/mmbsites/kadesh`
- [ ] Terminal: `chmod -R 775 /home/mmbsites/kadesh/storage`

### 6. Admin
- [ ] Criar usuário admin no banco (via phpMyAdmin)
- [ ] OU criar script temporário `create-admin.php`
- [ ] Testar login

---

## 🔄 CPANEL - ATUALIZAÇÕES

### Automático (se webhook configurado)
- [ ] `git push origin producao` no PC
- [ ] Aguardar 1-2 minutos
- [ ] Verificar se atualizou

### Manual
- [ ] Git Version Control → Repositório
- [ ] "Pull or Deploy"
- [ ] "Update from Remote"
- [ ] Aguardar conclusão

---

## 🧪 TESTES PÓS-DEPLOY

### Acesso Básico
- [ ] Site carrega: `https://kadesh.mmbsites.com.br`
- [ ] CSS carregando (F12 → Network)
- [ ] JS carregando
- [ ] Sem erros 404 no console

### Funcionalidades
- [ ] Registro de usuário
- [ ] Login de usuário
- [ ] Login de admin
- [ ] Criar projeto
- [ ] Ver projetos
- [ ] Fazer proposta

### Admin
- [ ] Acesso: `/admin/dashboard`
- [ ] Ver estatísticas
- [ ] Abrir configurações: `/admin/settings`
- [ ] Salvar configuração teste

### Mercado Pago
- [ ] Configurar chaves PROD em `/admin/settings`
- [ ] Ambiente: PROD
- [ ] Salvar e recarregar

---

## 🔐 SEGURANÇA

- [ ] HTTPS ativo (SSL)
- [ ] Forçar HTTPS (.htaccess)
- [ ] Remover arquivos de dev (`*.php` temporários)
- [ ] Remover `node_modules/` (se existir)
- [ ] Senhas fortes anotadas em local seguro

---

## 📊 MONITORAMENTO

- [ ] Verificar logs: cPanel → Errors
- [ ] Verificar acessos: cPanel → Raw Access
- [ ] Configurar backup automático
- [ ] Testar recuperação de backup

---

## 🎯 CONFIGURAÇÕES FINAIS

- [ ] Mercado Pago: chaves PROD
- [ ] Ambiente: PROD
- [ ] Taxa plataforma: 1%
- [ ] Email SMTP configurado (se disponível)
- [ ] Nome do site correto

---

## 📝 DOCUMENTAÇÃO

- [ ] Anotar credenciais do banco
- [ ] Anotar senha do admin
- [ ] Anotar chaves do Mercado Pago
- [ ] Guardar em local seguro (1Password, LastPass, etc.)

---

## ✅ CONCLUÍDO?

Se todos os itens acima estão marcados:

🎉 **DEPLOY CONCLUÍDO COM SUCESSO!**

**URLs**:
- 🌐 Site: https://kadesh.mmbsites.com.br
- 🛡️ Admin: https://kadesh.mmbsites.com.br/admin/dashboard
- ⚙️ Config: https://kadesh.mmbsites.com.br/admin/settings

---

**Data**: ___/___/______  
**Responsável**: _______________  
**Tempo total**: _____ minutos
