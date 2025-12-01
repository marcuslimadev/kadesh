# Sistema de Perfil Unificado - "Ver como"

## 📋 Resumo da Implementação

Implementação completa do sistema de **perfis unificados** que permite aos usuários alternarem entre os modos **Contratante** e **Prestador** sem necessidade de múltiplas contas.

---

## ✅ Mudanças Implementadas

### 1. **Frontend - Pinia Store**
**Arquivo:** `src/stores/viewModeStore.js` *(NOVO)*

- Store Pinia para gerenciar o modo de visualização ativo
- Estados: `contractor` (Contratante) ou `provider` (Prestador)
- Persistência no `localStorage` (`kadesh_view_mode`)
- Getters computados: `isContractor`, `isProvider`, `modeLabel`, `modeIcon`, `modeColor`
- Actions: `setMode()`, `toggleMode()`, `setContractorMode()`, `setProviderMode()`

### 2. **Frontend - Componente Switch**
**Arquivo:** `src/components/ViewModeSwitch.vue` *(NOVO)*

**Versão Desktop:**
- Toggle visual com 2 botões lado a lado
- Gradiente azul (Contratante) e verde (Prestador)
- Ícones: 👔 (Contratante) e ⚙️ (Prestador)

**Versão Mobile:**
- Botão único que alterna entre os dois modos
- Exibe o modo atual dinamicamente

**Tooltip Educacional:**
- Aparece nas primeiras 3 vezes que o usuário acessa
- Contador salvo no `localStorage` (`kadesh_viewmode_tooltip_count`)
- Auto-dismiss após 5 segundos
- Pode ser fechado manualmente

### 3. **Frontend - NavBar Dinâmico**
**Arquivo:** `src/components/layout/NavBar.vue` *(MODIFICADO)*

**Mudanças:**
- Adicionado componente `<ViewModeSwitch />` no topo (desktop e mobile)
- Substituído `authStore.isClient/isProvider` por `viewMode.isContractor/isProvider`
- Menus específicos por perfil:
  - **Contratante:** Projetos, Meus Projetos
  - **Prestador:** Minhas Propostas, Contratos
- Menus comuns: Lobby, Dashboard, Carteira, Comprovantes, Notificações

### 4. **Frontend - Dashboard Dinâmico**
**Arquivo:** `src/views/Dashboard.vue` *(MODIFICADO)*

**Mudanças:**
- Importado `useViewModeStore`
- Botões de ação rápida ajustados:
  - **Contratante:** "Novo Projeto"
  - **Prestador:** "Minhas Propostas"
- Cards de estatísticas adaptados:
  - **Contratante:** "Projetos Criados"
  - **Prestador:** "Projetos Ganhos"

### 5. **Frontend - Cadastro Unificado**
**Arquivo:** `src/views/Register.vue` *(MODIFICADO)*

**Mudanças:**
- **Removido:** Seleção de tipo de usuário (botões Contratante/Prestador)
- **Adicionado:** Info box explicando o novo sistema de switch
- Formulário simplificado: Nome, Email, Senha, Confirmar Senha, Aceitar Termos
- Propriedade `type` removida do objeto `form`
- Registro não envia mais `type` para o backend

### 6. **Backend - Rota de Registro**
**Arquivo:** `backend/routes/auth.js` *(MODIFICADO)*

**Mudanças:**
- Removida validação de `type` (não aceita mais `client` ou `provider`)
- Todos os novos usuários são criados com `type = 'unified'`
- Comentário explicativo no código sobre o novo sistema
- JWT gerado com `type: 'unified'`

### 7. **Backend - Migration SQL**
**Arquivo:** `backend/database/migrations/add_unified_type.sql` *(NOVO)*

**Ações:**
- Altera coluna `users.type` de ENUM para VARCHAR(20)
- Atualiza todos os usuários existentes para `type = 'unified'`
- Adiciona comentário na coluna explicando o novo sistema
- Query de verificação para conferir a migração

### 8. **Frontend - Tutorial Atualizado**
**Arquivo:** `src/views/Tutorial.vue` *(MODIFICADO)*

**Mudanças:**
- Seção 1 reescrita explicando o cadastro unificado
- Adicionada explicação sobre o switch "Ver como" com ícone 🔄
- Novo card explicativo com grid comparando os dois modos
- Dica sobre como o Lobby muda conforme o perfil ativo
- Removida menção a "escolher entre Contratante ou Prestador" no cadastro

### 9. **Frontend - Correção Crítica**
**Arquivo:** `src/views/CreateProject.vue` *(CORRIGIDO)*

**Problema:** 
- HTML duplicado nas linhas 463-678 causando erro de build Docker
- Tag `</template>` prematura na linha 461

**Solução:**
- Usado PowerShell para extrair partes corretas do arquivo
- Removido bloco duplicado (linhas 463-678)
- Build Docker frontend agora funciona ✅

---

## 🎨 Fluxo de Usuário

### Novo Cadastro
1. Usuário acessa `/register`
2. Vê info box explicando o novo sistema
3. Preenche formulário simplificado (sem escolher tipo)
4. Backend cria usuário com `type = 'unified'`
5. Após login, vê switch "Ver como" no topo

### Uso do Switch
1. Usuário logado vê switch no NavBar
2. Clica em "Contratante" ou "Prestador" (ou toggle no mobile)
3. Interface completa muda instantaneamente:
   - Menus do NavBar
   - Botões do Dashboard
   - Textos e labels contextuais
4. Preferência salva no `localStorage`
5. Na próxima sessão, mantém o último perfil selecionado

### Tooltip Educacional
1. Aparece automaticamente nas primeiras 3 visitas
2. Mostra: "Alterne entre Contratante e Prestador a qualquer momento! 🔄"
3. Pode ser fechado clicando em "OK"
4. Auto-dismiss após 5 segundos
5. Após 3 vezes, não aparece mais

---

## 🔧 Arquivos Criados

```
src/
├── stores/
│   └── viewModeStore.js          # Pinia store para gerenciar modo ativo
├── components/
│   └── ViewModeSwitch.vue        # Componente do switch visual
backend/
└── database/
    └── migrations/
        └── add_unified_type.sql  # Migration para usuários existentes
```

---

## 📝 Arquivos Modificados

```
src/
├── components/
│   └── layout/
│       └── NavBar.vue            # Menus dinâmicos por perfil
├── views/
│   ├── Dashboard.vue             # Dashboard adaptado ao modo ativo
│   ├── Register.vue              # Cadastro unificado sem escolha de tipo
│   ├── Tutorial.vue              # Tutorial explicando novo sistema
│   └── CreateProject.vue         # Correção de HTML duplicado
backend/
└── routes/
    └── auth.js                   # Registro criando tipo 'unified'
```

---

## 🚀 Próximos Passos Sugeridos

### 1. **Executar Migration SQL**
```bash
cd backend
psql -U postgres -d kadesh_db -f database/migrations/add_unified_type.sql
```

### 2. **Testar Fluxo Completo**
- [ ] Criar novo usuário (não deve pedir tipo)
- [ ] Verificar switch aparece após login
- [ ] Alternar entre Contratante e Prestador
- [ ] Verificar menus mudam corretamente
- [ ] Conferir persistência no localStorage
- [ ] Testar tooltip educacional

### 3. **Atualizar Testes E2E**
- Modificar `tests/user-flow.spec.js` para não selecionar tipo no cadastro
- Adicionar testes para o switch "Ver como"
- Validar menus dinâmicos

### 4. **Revisar Outras Views**
Verificar se há outras páginas que usam `authStore.isClient/isProvider`:
- `src/views/Lobby.vue`
- `src/views/MyProjects.vue`
- `src/views/MyBids.vue`
- Componentes de projeto/contrato

### 5. **Documentação de API**
Atualizar docs do backend explicando:
- Campo `type` agora aceita `'unified'`
- Usuários antigos (`client`/`provider`) ainda funcionam
- Novos registros sempre criam como `'unified'`

---

## ⚠️ Considerações Importantes

### Compatibilidade com Usuários Antigos
- Usuários com `type = 'client'` ou `type = 'provider'` continuam funcionando
- Migration SQL atualiza todos para `'unified'`
- Se não rodar a migration, podem coexistir 3 tipos no banco

### LocalStorage Keys
- `kadesh_view_mode`: Armazena modo ativo (`contractor`/`provider`)
- `kadesh_viewmode_tooltip_count`: Contador de exibições do tooltip (max 3)

### Backend Type Field
A coluna `users.type` agora aceita:
- `'unified'` (padrão para novos usuários)
- `'client'` (legado, deve ser migrado)
- `'provider'` (legado, deve ser migrado)

---

## 🎯 Benefícios da Mudança

### Para o Usuário
✅ **Flexibilidade total** - Pode contratar e prestar serviços com uma única conta  
✅ **Sem cadastros duplicados** - Uma conta, múltiplos perfis  
✅ **Troca instantânea** - Alterna entre perfis em 1 clique  
✅ **Interface adaptável** - Menus e dashboards mudam automaticamente  

### Para o Negócio
✅ **Maior retenção** - Usuários não precisam criar conta nova para testar outro perfil  
✅ **Mais engajamento** - Facilita usar ambos os lados da plataforma  
✅ **Menor fricção** - Cadastro mais simples (menos campos)  
✅ **Dados consolidados** - Métricas unificadas por usuário  

### Para o Desenvolvimento
✅ **Código mais limpo** - viewModeStore centraliza lógica de perfil  
✅ **Manutenção facilitada** - Um único fluxo de cadastro  
✅ **Menos bugs** - Não há sincronização entre contas  
✅ **Escalável** - Fácil adicionar novos perfis no futuro  

---

## 📊 Métricas Recomendadas

Após deploy, monitorar:
- % de usuários que usam o switch pelo menos 1x
- Média de alternâncias por usuário/dia
- Taxa de conversão do cadastro (deve aumentar)
- Tempo até primeira troca de perfil
- Tooltip: quantos dismisses manuais vs auto-dismiss

---

## 🐛 Possíveis Problemas e Soluções

### Problema: Switch não aparece
**Causa:** Store não importado corretamente  
**Solução:** Verificar `import { useViewModeStore } from '@/stores/viewModeStore'`

### Problema: Modo não persiste após reload
**Causa:** localStorage não está salvando  
**Solução:** Verificar se `setMode()` está sendo chamado no store

### Problema: Menus não mudam
**Causa:** Componentes usando `authStore` ao invés de `viewMode`  
**Solução:** Procurar por `isClient`/`isProvider` e substituir por `viewMode.isContractor`/`isProvider`

### Problema: Usuários antigos não conseguem logar
**Causa:** Migration não executada, tipo `'client'`/`'provider'` inválido  
**Solução:** Executar `add_unified_type.sql` ou ajustar validação do backend

---

## 📞 Contato para Dúvidas

Em caso de problemas com a implementação, verificar:
1. Console do navegador (erros de import)
2. Network tab (requisições ao backend)
3. Application tab → Local Storage (chaves `kadesh_*`)
4. Logs do backend (erros de validação)

---

**Status:** ✅ Implementação Completa  
**Versão:** 2.0  
**Data:** 26/11/2025  
**Autor:** GitHub Copilot  
