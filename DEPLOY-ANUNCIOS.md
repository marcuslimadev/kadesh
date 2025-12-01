# 🚀 Deploy e Configuração do Sistema de Anúncios - Guia Rápido

## ⚡ Executar em Produção (Render.com)

### Passo 1: Acessar Shell do Backend

1. Acesse o [Render Dashboard](https://dashboard.render.com)
2. Selecione o serviço **kadesh-backend** (ou nome do seu backend)
3. Clique na aba **"Shell"** no menu lateral
4. Aguarde o shell carregar

### Passo 2: Popular Anúncios

Execute o comando:

```bash
npm run db:seed
```

**Saída esperada:**
```
🌱 Iniciando população de anúncios...

✅ Anúncios criados com sucesso!

Resumo:
   home_featured: 3 anúncios
   left: 2 anúncios
   right: 2 anúncios

📊 Total: 7 anúncios criados

✨ Processo concluído!
```

### Passo 3: Verificar

Acesse sua aplicação frontend:
```
https://kadesh-frontend.onrender.com
```

Você deve ver:
- ✅ Rails laterais com anúncios
- ✅ Banners em destaque na home
- ✅ Sem erros 404 no console

---

## 🖥️ Executar Localmente (Desenvolvimento)

### Pré-requisitos
- PostgreSQL instalado e rodando
- Banco de dados `kadesh` criado
- Variável `DATABASE_URL` configurada

### Comando

```bash
cd backend
npm run db:seed
```

---

## 🔍 Verificar se Funcionou

### Opção 1: Via Frontend
1. Acesse a home da aplicação
2. Verifique se aparecem banners e rails laterais
3. Console do navegador NÃO deve mostrar erro 404

### Opção 2: Via API Direta
```bash
curl https://kadesh-2.onrender.com/api/advertisements?position=left
```

**Resposta esperada:**
```json
[
  {
    "id": "uuid-aqui",
    "title": "Impulsione seu Projeto",
    "description": "Destaque seu projeto...",
    "link_url": "/auction-lobby",
    "position": "left",
    "slot": 1,
    ...
  }
]
```

### Opção 3: Via Banco de Dados
```sql
SELECT COUNT(*) FROM advertisements WHERE is_active = TRUE;
```

Deve retornar: **7**

---

## ❌ Troubleshooting

### "Já existem X anúncios no banco"

**Solução:** Os anúncios já foram criados antes. Está tudo OK!

Se quiser recriar:
```sql
DELETE FROM advertisements;
```
Depois execute `npm run db:seed` novamente.

### Erro "Cannot find module '../config/database'"

**Causa:** Executou o comando fora da pasta `backend`

**Solução:**
```bash
cd backend
npm run db:seed
```

### API retorna array vazio []

**Causa:** Anúncios não foram criados ou estão inativos

**Verificar:**
```sql
SELECT * FROM advertisements;
```

**Ativar todos:**
```sql
UPDATE advertisements SET is_active = TRUE;
```

### Ainda vê anúncios mock

**Causa:** Frontend está usando fallback porque API falhou

**Verificar:**
1. Backend está rodando?
2. URL da API está correta?
3. Banco de dados tem os anúncios?

**Console do navegador deve mostrar:**
```
✅ Sem erros 404
✅ Sem mensagem "usando mock"
```

---

## 📋 Checklist Completo

- [ ] Backend deployado no Render
- [ ] Banco PostgreSQL conectado
- [ ] Executado `npm run db:seed` no shell do Render
- [ ] API `/api/advertisements` retorna dados (não erro 404)
- [ ] Frontend mostra anúncios reais (não mocks)
- [ ] Painel admin `/admin/advertisements` funciona
- [ ] Métricas de impressões/cliques incrementando

---

## 🎯 Próximos Passos

Após popular os anúncios:

1. **Acessar Painel Admin:**
   - Login: admin@kadesh.local
   - Senha: admin123
   - URL: `/admin/login`

2. **Gerenciar Anúncios:**
   - Editar títulos/descrições
   - Adicionar imagens
   - Configurar datas de campanha
   - Visualizar métricas

3. **Criar Novos Anúncios:**
   - Clique em "Novo Anúncio"
   - Preencha os campos
   - Escolha posição (left/right/home_featured)
   - Defina slot (ordem)
   - Marque como ativo

4. **Monitorar Performance:**
   - Veja impressões e cliques
   - Calcule CTR (click-through rate)
   - Otimize títulos e descrições

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique logs do backend no Render
2. Verifique console do navegador (F12)
3. Execute queries SQL para debug
4. Consulte `docs/SISTEMA-ANUNCIOS.md` para guia completo

**Tudo pronto! O sistema de anúncios está 100% funcional! 🎉**
