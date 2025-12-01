# 🔐 Credenciais de Administrador - Sistema Kadesh

## 👤 Login Administrativo

### Credenciais Padrão

**URL de Login:**
```
https://kadesh-frontend.onrender.com/admin/login
```

**Email:**
```
admin@kadesh.local
```

**Senha:**
```
admin123
```

---

## 🎯 Acesso ao Painel de Anúncios

Após fazer login:

1. **Dashboard Admin** aparecerá automaticamente
2. Clique em **"Anúncios"** no menu lateral
3. Ou acesse diretamente: `/admin/advertisements`

---

## 📋 O que você pode fazer:

### Gerenciar Anúncios
- ✅ **Criar** novos anúncios
- ✅ **Editar** anúncios existentes
- ✅ **Ativar/Desativar** anúncios com toggle
- ✅ **Deletar** anúncios
- ✅ **Visualizar métricas** (impressões, cliques, CTR)

### Criar Novo Anúncio
1. Clique em **"Novo Anúncio"**
2. Preencha:
   - **Título** (até 255 caracteres)
   - **Descrição** (texto completo)
   - **URL do Link** (para onde o anúncio leva)
   - **URL da Imagem** (opcional)
   - **Posição**: 
     - `left` - Rail esquerda
     - `right` - Rail direita
     - `home_featured` - Banners da home
   - **Slot** (ordem: 1, 2, 3...)
   - **Data Início** (opcional - quando começa a aparecer)
   - **Data Fim** (opcional - quando para de aparecer)
   - **Ativo** (checkbox - marque para ativar)
3. Clique em **"Salvar"**

### Editar Anúncio
1. Clique no ícone de **lápis** (✏️)
2. Modifique os campos
3. Salve as alterações

### Ver Métricas
- **Impressões**: Quantas vezes foi visualizado
- **Cliques**: Quantas vezes foi clicado
- **CTR**: Taxa de cliques (cliques ÷ impressões × 100%)

---

## 🔄 Anúncios Criados Automaticamente

Quando o backend faz deploy, **7 anúncios de exemplo** são criados automaticamente:

### Left Rail (2)
1. **Impulsione seu Projeto**
   - Descrição: Destaque seu projeto e encontre os melhores profissionais
   - Link: `/auction-lobby`

2. **Seja um Prestador Premium**
   - Descrição: Aumente sua visibilidade com planos premium
   - Link: `/provider-profile`

### Right Rail (2)
1. **Suporte 24/7**
   - Descrição: Nossa equipe está sempre disponível
   - Link: `/tutorial`

2. **Pagamentos 100% Seguros**
   - Descrição: Transações protegidas com Mercado Pago
   - Link: `/wallet`

### Home Featured (3)
1. **🎯 Projetos Premium**
   - Link: `/auction-lobby`

2. **💎 Prestador Elite**
   - Link: `/provider-profile`

3. **🔒 Pagamentos Seguros**
   - Link: `/wallet`

---

## ⚙️ Outras Funções Administrativas

Além de anúncios, você pode acessar:

### Menu Admin Completo:
- 📊 **Dashboard** - Visão geral do sistema
- 👥 **Usuários** - Gerenciar usuários, promover a admin
- 📁 **Projetos** - Ver e moderar projetos
- 💰 **Pagamentos** - Transações e carteiras
- ⚖️ **Disputas** - Resolver conflitos
- 📢 **Anúncios** - Gerenciar anúncios (NOVO!)
- ⚙️ **Configurações** - Mercado Pago, sistema

---

## 🔒 Segurança

### ⚠️ IMPORTANTE - Altere a Senha Padrão!

**A senha `admin123` é temporária e deve ser alterada!**

Para alterar:
1. Faça login como admin
2. Vá em **Configurações** ou **Perfil**
3. Altere para uma senha forte

### Criar Novo Administrador

Se quiser criar outro usuário admin:

1. Acesse **Usuários** no painel
2. Encontre o usuário que quer promover
3. Clique em **"Promover a Admin"**
4. Defina username e senha
5. Pronto! Novo admin criado

---

## 🚀 Deploy Automático de Anúncios

### Como funciona:

Quando você faz **push para main**, o Render automaticamente:

1. ✅ Faz build do backend
2. ✅ Conecta no banco de dados
3. ✅ **Executa seed de anúncios** (se não existirem)
4. ✅ Inicia o servidor

**Você não precisa fazer nada manualmente!**

### Verificar se funcionou:

1. Aguarde o deploy completar no Render
2. Acesse a home: `https://kadesh-frontend.onrender.com`
3. Veja se aparecem:
   - Rails laterais com anúncios
   - Banners na home
4. Faça login no admin e veja os 7 anúncios criados

---

## 🛠️ Troubleshooting

### Anúncios não aparecem após deploy

**Solução 1: Verificar logs do Render**
1. Vá no Render Dashboard
2. Selecione `kadesh-backend`
3. Clique em "Logs"
4. Procure por:
   ```
   🌱 Verificando anúncios no banco...
   ✅ Anúncios criados com sucesso!
   ```

**Solução 2: Executar seed manualmente**
1. Abra o Shell do backend no Render
2. Execute:
   ```bash
   npm run db:seed
   ```

### Esqueci a senha de admin

**Resetar via SQL:**
```sql
-- Senha volta para 'admin123'
UPDATE admin_users 
SET password = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO'
WHERE username = 'admin';
```

Execute no PgAdmin ou shell do Render.

---

## 📞 Contatos e Suporte

**Documentação Completa:**
- `docs/SISTEMA-ANUNCIOS.md` - Guia técnico completo
- `DEPLOY-ANUNCIOS.md` - Guia de deploy rápido

**Dúvidas?**
- Consulte a documentação
- Verifique logs do Render
- Execute queries SQL para debug

---

## ✅ Checklist de Verificação

Após deploy, confirme:

- [ ] Login admin funciona
- [ ] Painel de anúncios acessível
- [ ] 7 anúncios aparecem na listagem
- [ ] Rails laterais mostram anúncios
- [ ] Banners aparecem na home
- [ ] Métricas incrementam ao visualizar
- [ ] Possível criar/editar/deletar anúncios
- [ ] Toggle ativar/desativar funciona

**Tudo funcionando? Sistema de anúncios está 100% operacional! 🎉**
