# Guia de Gerenciamento de Anúncios

## Visão Geral

O sistema de anúncios permite que o administrador publique e gerencie banners publicitários que aparecem nas laterais do Lobby de Leilões (AdRail).

## Recursos

### 1. Painel Administrativo

Acesse: **Painel Admin → Anúncios**

URL: `/#/admin/advertisements`

### 2. Funcionalidades

#### ✅ Criar Novo Anúncio

1. Clique em **"Novo Anúncio"**
2. Preencha os campos:
   - **Título*** (obrigatório) - Ex: "Destaque sua Marca"
   - **Descrição*** (obrigatória) - Ex: "Reserve um banner premium..."
   - **Link (URL)** (opcional) - URL para onde o usuário será direcionado ao clicar
   - **URL da Imagem** (opcional) - Link da imagem do banner
   - **Posição*** - `Esquerda` ou `Direita` (lado da tela)
   - **Slot (ordem)*** - 1 a 10 (ordem de exibição, menor = mais acima)
   - **Data Início** (opcional) - Quando o anúncio começa a ser exibido
   - **Data Fim** (opcional) - Quando o anúncio para de ser exibido
   - **Anúncio ativo** - Checkbox para ativar/desativar

3. Visualize o **Preview** em tempo real
4. Clique em **"Salvar Anúncio"**

#### ✏️ Editar Anúncio

1. Clique no ícone de **lápis/editar** no card do anúncio
2. Modifique os campos necessários
3. Clique em **"Salvar Anúncio"**

#### 🔄 Ativar/Desativar Anúncio

- Clique no ícone de **check/X** para alternar o status
- Anúncios inativos não aparecem para os usuários

#### 🗑️ Deletar Anúncio

- Clique no ícone de **lixeira**
- Confirme a exclusão
- ⚠️ **Ação irreversível!**

### 3. Filtros e Busca

- **Buscar**: Digite palavras-chave do título ou descrição
- **Status**: Filtrar por `Todos`, `Apenas Ativos`, `Apenas Inativos`
- **Posição**: Filtrar por `Todas`, `Esquerda`, `Direita`

### 4. Métricas e Analytics

Cada anúncio mostra:

- **Impressões**: Quantas vezes foi exibido
- **Cliques**: Quantas vezes foi clicado (se tiver link)
- **CTR (Click-Through Rate)**: Taxa de clique (cliques/impressões × 100)

### 5. Boas Práticas

#### 📝 Título
- Máximo 50 caracteres
- Seja direto e chamativo
- Exemplos: "Destaque sua Marca", "Campanhas 360º"

#### 📄 Descrição
- Máximo 150 caracteres
- Explique o benefício
- Use call-to-action
- Exemplo: "Reserve um banner premium e destaque sua marca para contratantes"

#### 🖼️ Imagem
- Tamanho recomendado: 240x160px
- Formato: JPG ou PNG
- Peso máximo: 500KB
- Use imagens otimizadas para web

#### 🔗 Link
- Use URLs completas (https://)
- Teste o link antes de publicar
- Use UTM parameters para tracking:
  ```
  https://exemplo.com?utm_source=kadesh&utm_medium=banner&utm_campaign=lobby
  ```

#### 📅 Agendamento
- Use **Data Início/Fim** para campanhas temporárias
- Deixe em branco para anúncios permanentes
- Anúncios expirados automaticamente param de aparecer

#### 📍 Posicionamento
- **Esquerda**: Maior visibilidade (posição primária)
- **Direita**: Visibilidade secundária
- **Slot**: Controla a ordem (1 = topo, 2 = meio, etc.)

### 6. Fluxo de Publicação

```
Criar Anúncio → Preview → Salvar → Ativar → Monitorar Métricas
                                         ↓
                                    Ajustar/Otimizar
```

### 7. Exemplo Prático

**Campanha de Black Friday:**

```yaml
Título: "Black Friday - 50% OFF"
Descrição: "Assine o plano Premium com 50% de desconto. Válido até 30/11!"
Link: "https://kadesh.com/premium?promo=bf2025"
Imagem: "https://cdn.kadesh.com/banners/bf2025.jpg"
Posição: "Esquerda"
Slot: 1
Data Início: "2025-11-22 00:00"
Data Fim: "2025-11-30 23:59"
Ativo: ✅
```

### 8. Troubleshooting

**Anúncio não aparece?**
- ✅ Verifique se está marcado como "Ativo"
- ✅ Confira se a Data Início já passou
- ✅ Confirme se a Data Fim não expirou
- ✅ Teste a URL da imagem (deve carregar no navegador)

**CTR muito baixo?**
- 📝 Melhore o título (seja mais chamativo)
- 🎨 Use imagem mais atrativa
- 🔗 Revise o link (deve ser relevante)
- 📍 Tente mudar a posição (esquerda tem mais destaque)

**Erros ao salvar?**
- ✅ Título e Descrição são obrigatórios
- ✅ URLs devem começar com http:// ou https://
- ✅ Slot deve ser entre 1 e 10
- ✅ Posição deve ser "left" ou "right"

## API Endpoints (para desenvolvedores)

### Públicos
```
GET  /api/advertisements?position=left  - Listar anúncios ativos
POST /api/advertisements/:id/click      - Registrar clique
```

### Admin (requer autenticação)
```
GET    /api/advertisements/admin        - Listar todos
GET    /api/advertisements/admin/:id    - Buscar um
POST   /api/advertisements/admin        - Criar
PUT    /api/advertisements/admin/:id    - Atualizar
DELETE /api/advertisements/admin/:id    - Deletar
PATCH  /api/advertisements/admin/:id/toggle - Ativar/Desativar
```

## Banco de Dados

### Migração

Execute o script de migração:

```bash
psql -U postgres -d kadesh -f backend/database/migrations/001_add_advertisements_table.sql
```

Ou use o schema completo:

```bash
psql -U postgres -d kadesh -f backend/database/schema.sql
```

### Tabela `advertisements`

```sql
CREATE TABLE advertisements (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    link_url VARCHAR(500),
    image_url VARCHAR(500),
    position VARCHAR(10) DEFAULT 'left',
    slot INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    click_count INTEGER DEFAULT 0,
    impression_count INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Arquivos Modificados

1. **Backend**:
   - `backend/database/schema.sql` - Tabela advertisements
   - `backend/routes/advertisements.js` - API de anúncios (novo)
   - `backend/server.js` - Registro da rota

2. **Frontend**:
   - `src/views/admin/AdminAdvertisements.vue` - Painel admin (novo)
   - `src/components/layout/AdRail.vue` - Integração com API
   - `src/router/index.js` - Rota /admin/advertisements
   - `src/views/admin/*.vue` - Links no menu

3. **Migrations**:
   - `backend/database/migrations/001_add_advertisements_table.sql` - Script de criação

## Próximos Passos

1. **Upload de Imagens**: Implementar upload direto de arquivos
2. **Analytics Avançado**: Dashboard de performance por período
3. **A/B Testing**: Testar variações de anúncios
4. **Segmentação**: Mostrar anúncios diferentes por perfil de usuário
5. **Notificações**: Alertar quando campanha está prestes a expirar

## Suporte

Em caso de dúvidas ou problemas, contate o administrador do sistema.
