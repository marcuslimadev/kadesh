# AUDITORIA DO FLUXO DE LEILÃO - KADESH

## Data: Janeiro 2026

## STATUS ATUAL: ❌ CARRO-CHEFE NÃO VALIDADO

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. LOBBY DE LEILÃO (Página Principal)

#### Problemas Visuais
- ✅ **Navegação de anúncios**: Rota `/ads` funciona corretamente
- ❌ **Cabeçalho muito alto**: Hero section ocupa espaço excessivo
- ❌ **Filtros com peso excessivo**: Seção de filtros mais destacada que os leilões
- ❌ **Stats ocupam muito espaço**: Três quadros de estatísticas reduzem espaço dos projetos
- ❌ **Leilão não é o foco visual**: Cards de projetos precisam de mais destaque

#### Estado Atual do Código
- Arquivo: `src/views/AuctionLobby.vue`
- Hero: linhas 7-24 (18 linhas de código)
- Stats: linhas 26-36 (grid 1x2, mas renderiza 3 itens via `lobbyHighlights`)
- Filtros: linhas 95-165 (70 linhas!)
- Grid de projetos: linhas 190-339

### 2. CRIAÇÃO E EXIBIÇÃO DE PROJETOS

#### Pós-Criação (Contratante)
- ❌ **Nome do contratante não aparece**: `project.client_name` pode não estar sendo carregado
- ❌ **Valores e prazos ilegíveis**: Falta contraste e hierarquia visual
- ❌ **Fotos não carregam em MyProjects**: Método `getCoverImage()` pode ter problema

#### Arquivo: `src/views/ProjectDetail.vue`
- Cabeçalho do projeto: linhas 34-59
- Budget/Deadline: linhas 61-83
- Carrossel de imagens: linhas 84-102 (estrutura já existe, pode não estar funcional)

### 3. VISÃO DO PRESTADOR

#### Descoberta do Projeto
- ❌ **Fotos não carregam**: Apenas imagem pequena isolada
- ❌ **Sem carrossel funcional**: Thumbnails não respondem ao clique
- ❌ **Prazos e valores não aparecem**: Dados podem não estar sendo renderizados

#### Campo de Proposta (PONTO CRÍTICO 🔴)
- ❌ **Campo não vem aberto**: `showBidForm = false` por padrão
- ❌ **Não é chamativo**: Falta destaque visual (pulsar, brilho, cor)
- ❌ **Ação secundária**: Objetivo principal (dar lance) fica escondido

#### Arquivo: `src/views/ProjectDetail.vue`
- Variável: linha 492 `const showBidForm = ref(false)` ← **PROBLEMA PRINCIPAL**
- Form de proposta: linhas 278-338
- Botão toggle: linha 275 `showBidForm = !showBidForm`

### 4. ENVIO E EXIBIÇÃO DE PROPOSTAS

#### Envio
- ❌ **Proposta não aparece abaixo do anúncio**: Após `submitBid()`, lista não atualiza
- ❌ **Lobby não atualiza**: Mesmo após `notifyProjectsUpdated()`
- ❌ **Dashboard não reflete**: Contador de propostas não muda

#### Recebimento (Contratante)
- ❌ **Propostas não aparecem para Maria**: `loadBids()` pode não estar sendo chamado
- ❌ **Sem feedback visual**: Usuário não sabe se proposta foi recebida

#### Arquivos Relevantes
- `src/views/ProjectDetail.vue`: `submitBid()` linha 849, `loadBids()` linha 813
- `src/services/bidService.js`: `createBid()` linha 11, evento linha 17
- `src/views/AuctionLobby.vue`: listener linha 893, `handleProjectsUpdated()` linha 890

### 5. CHAT NAS PROPOSTAS

#### Problema
- ❌ **Botão de chat não encontrado**: Não existe em propostas/bids
- ⚠️ **Ambiguidade**: Não está claro quando chat é liberado

#### Solução
- ChatBox só aparece em `ContractDetail.vue` (linha 79)
- Precisa de indicação clara: "Chat liberado após aceitar proposta"

---

## 🎯 FLUXO ESPERADO (vs REALIDADE)

| Etapa | Esperado | Realidade | Status |
|-------|----------|-----------|--------|
| 1. Cadastro | Usuário cria conta | ✅ Funciona | ✅ |
| 2. Criação de projeto | Contratante publica projeto | ✅ Funciona | ✅ |
| 3. Exibição no lobby | Projeto aparece com fotos, valores, prazos | ❌ Fotos inconsistentes, dados ilegíveis | ❌ |
| 4. Prestador encontra | Projeto visível com todos os dados | ❌ Carrossel não funcional | ❌ |
| 5. Campo de proposta | Aberto e destacado | ❌ Fechado por padrão | 🔴 |
| 6. Dar lance | Prestador envia proposta | ✅ Backend salva | ⚠️ |
| 7. Lance aparece | Proposta visível abaixo do projeto | ❌ Não aparece | 🔴 |
| 8. Atualização lobby | Contador de propostas aumenta | ❌ Não atualiza | ❌ |
| 9. Contratante vê propostas | Maria acessa projeto e vê lances | ❌ Não aparecem | 🔴 |
| 10. Definir vencedor | Aceitar proposta mais baixa | ⚠️ Funcional mas sem UX | ⚠️ |
| 11. Notificações | Ambos recebem alertas | ❓ Não testado | ❓ |
| 12. Chat liberado | Comunicação entre partes | ⚠️ Só em ContractDetail | ⚠️ |
| 13. Execução | Milestones, pagamentos | ⚠️ Estrutura existe | ⚠️ |
| 14. Avaliação | Review mútuo | ⚠️ ReviewForm existe | ⚠️ |

**Legenda**: ✅ Funciona | ⚠️ Parcial | ❌ Quebrado | 🔴 Crítico | ❓ Não validado

---

## 🛠️ CORREÇÕES PRIORITÁRIAS

### Alta Prioridade (Impedem uso do leilão)

1. **Abrir campo de proposta automaticamente**
   - Arquivo: `src/views/ProjectDetail.vue` linha 492
   - Mudança: `const showBidForm = ref(true)` para prestadores
   - Adicionar: classe CSS com animação `ring-pulse` quando aberto

2. **Exibir propostas após envio**
   - Arquivo: `src/views/ProjectDetail.vue` linha 849
   - Garantir: `await loadBids()` após `submitBid()`
   - Adicionar: scroll automático para seção de propostas

3. **Atualizar lobby com novas propostas**
   - Arquivo: `src/views/AuctionLobby.vue` linha 890
   - Verificar: listener de `kadesh:projects-updated` está ativo
   - Adicionar: polling de 30s como fallback

4. **Corrigir visibilidade de valores/prazos**
   - Arquivo: `src/views/ProjectDetail.vue` linhas 61-83
   - Aumentar: tamanho da fonte de valores (de `text-2xl` para `text-4xl`)
   - Melhorar: contraste do deadline (usar `text-heading` em vez de `text-lg`)

### Média Prioridade (UX/Visual)

5. **Reduzir cabeçalho do lobby**
   - Arquivo: `src/views/AuctionLobby.vue` linhas 7-24
   - Reduzir: padding de `space-y-3` para `space-y-2`
   - Compactar: descrição em uma linha com `text-sm`

6. **Destacar cards de leilão**
   - Arquivo: `src/views/AuctionLobby.vue` linhas 190-339
   - Aumentar: tamanho dos cards (adicionar `scale-105` no hover)
   - Adicionar: border gold pulsante em projetos com deadline <24h

7. **Corrigir carrossel de imagens**
   - Arquivo: `src/views/ProjectDetail.vue` linhas 84-102
   - Já existe: estrutura de thumbnails clicáveis
   - Verificar: `activeImage` está sendo setado corretamente

### Baixa Prioridade (Polimento)

8. **Indicação de chat**
   - Arquivo: `src/views/ProjectDetail.vue` (seção de propostas)
   - Adicionar: badge "💬 Chat liberado após aceitar proposta"

9. **Dashboard refletir propostas**
   - Arquivo: `src/views/Dashboard.vue`
   - Adicionar: query para buscar `recent_bids` via API

---

## 📊 MÉTRICAS DE SUCESSO

Após correções, validar:

✅ Prestador entra em projeto e vê campo de proposta aberto
✅ Após enviar lance, proposta aparece na lista imediatamente  
✅ Contratante vê contador de propostas atualizado no lobby
✅ Contratante acessa projeto e vê todas as propostas  
✅ Valores e prazos legíveis em todas as telas  
✅ Fotos carregam corretamente (lobby, MyProjects, ProjectDetail)  
✅ Carrossel de imagens funcional com clique nos thumbnails  
✅ Dashboard mostra estatísticas de propostas enviadas/recebidas  

---

## 🚀 PRÓXIMOS PASSOS

1. Implementar correções de **Alta Prioridade** (itens 1-4)
2. Testar fluxo completo: Maria cria projeto → Pedro dá lance → Maria vê proposta
3. Validar visualmente: cabeçalho compacto, leilões em destaque
4. Implementar polling/websocket para atualizações em tempo real
5. Adicionar indicadores visuais claros (badges, contadores, notificações)
6. Documentar fluxo validado em `FLUXO-LEILAO-VALIDADO.md`

---

**Conclusão**: O backend funciona, mas a UI/UX quebra o fluxo. As correções são majoritariamente frontend (Vue components + CSS).
