# Sistema de Anúncios - Guia de Uso

## 📋 Visão Geral

O sistema de anúncios do Kadesh permite exibir conteúdo promocional em diferentes posições da plataforma:
- **Left Rail**: Barra lateral esquerda
- **Right Rail**: Barra lateral direita  
- **Home Featured**: Banners em destaque na página inicial

## 🚀 Como Popular o Banco de Dados

### Opção 1: Script Automático (Recomendado)

```bash
cd backend
npm run db:seed
```

Este comando:
- ✅ Verifica se já existem anúncios
- ✅ Cria 7 anúncios de exemplo
- ✅ Exibe resumo do que foi criado

### Opção 2: SQL Manual

Execute o arquivo SQL diretamente no PostgreSQL:

```bash
psql -U postgres -d kadesh -f backend/database/seeds/001_seed_advertisements.sql
```

### Opção 3: Via PgAdmin / Cliente Visual

1. Abra seu cliente PostgreSQL
2. Conecte no banco `kadesh`
3. Execute o conteúdo de `backend/database/seeds/001_seed_advertisements.sql`

## 📊 Anúncios Criados (Seed)

### Left Rail (2 anúncios)
| Slot | Título | Descrição | Link |
|------|--------|-----------|------|
| 1 | Impulsione seu Projeto | Destaque seu projeto e encontre os melhores profissionais | /auction-lobby |
| 2 | Seja um Prestador Premium | Aumente sua visibilidade com planos premium | /provider-profile |

### Right Rail (2 anúncios)
| Slot | Título | Descrição | Link |
|------|--------|-----------|------|
| 1 | Suporte 24/7 | Nossa equipe está sempre disponível | /tutorial |
| 2 | Pagamentos 100% Seguros | Transações protegidas com Mercado Pago | /wallet |

### Home Featured (3 banners)
| Slot | Título | Descrição | Link |
|------|--------|-----------|------|
| 1 | 🎯 Projetos Premium | Melhores profissionais com garantia | /auction-lobby |
| 2 | 💎 Prestador Elite | Destaque-se e ganhe mais | /provider-profile |
| 3 | 🔒 Pagamentos Seguros | Sistema de escrow com MP | /wallet |

## 🎨 Gerenciamento via Painel Admin

### Acessar Painel
1. Faça login como admin: `/admin/login`
2. Acesse "Anúncios" no menu lateral
3. URL: `/admin/advertisements`

### Criar Novo Anúncio
1. Clique em "Novo Anúncio"
2. Preencha os campos:
   - **Título** (máx 255 caracteres)
   - **Descrição** (texto detalhado)
   - **URL do Link** (opcional)
   - **URL da Imagem** (opcional)
   - **Posição**: `left`, `right`, ou `home_featured`
   - **Slot** (ordem de exibição: 1, 2, 3...)
   - **Data Início/Fim** (opcional - para campanhas temporárias)
   - **Ativo** (checkbox)
3. Clique em "Salvar"

### Editar Anúncio
1. Clique no ícone de edição (✏️)
2. Modifique os campos desejados
3. Salve as alterações

### Ativar/Desativar
- Use o toggle para ativar/desativar anúncios rapidamente
- Anúncios inativos não aparecem no frontend

### Deletar Anúncio
1. Clique no ícone de lixeira (🗑️)
2. Confirme a exclusão

## 📡 Endpoints da API

### Público (Frontend)

#### Listar Anúncios Ativos
```http
GET /api/advertisements
Query Params:
  - position: left | right | home_featured (opcional)

Response:
[
  {
    "id": "uuid",
    "title": "Título do Anúncio",
    "description": "Descrição completa",
    "link_url": "/link",
    "image_url": null,
    "position": "left",
    "slot": 1,
    "impression_count": 1250,
    "click_count": 89
  }
]
```

#### Registrar Clique
```http
POST /api/advertisements/:id/click

Response:
{ "success": true }
```

### Admin (Painel Administrativo)

#### Listar Todos (incluindo inativos)
```http
GET /api/advertisements/admin
Headers: Authorization: Bearer {admin_token}

Response: Array de anúncios com campos adicionais
```

#### Buscar Específico
```http
GET /api/advertisements/admin/:id
Headers: Authorization: Bearer {admin_token}
```

#### Criar Novo
```http
POST /api/advertisements/admin
Headers: Authorization: Bearer {admin_token}
Body: {
  "title": "string",
  "description": "string",
  "link_url": "string (opcional)",
  "image_url": "string (opcional)",
  "position": "left|right|home_featured",
  "slot": number,
  "is_active": boolean,
  "start_date": "timestamp (opcional)",
  "end_date": "timestamp (opcional)"
}
```

#### Atualizar
```http
PUT /api/advertisements/admin/:id
Headers: Authorization: Bearer {admin_token}
Body: Campos a atualizar
```

#### Deletar
```http
DELETE /api/advertisements/admin/:id
Headers: Authorization: Bearer {admin_token}
```

#### Toggle Ativo/Inativo
```http
PATCH /api/advertisements/admin/:id/toggle
Headers: Authorization: Bearer {admin_token}
```

## 🔄 Sistema de Fallback

O frontend possui sistema inteligente de fallback:

1. **Tenta buscar da API** primeiro
2. **Se falhar (404, erro de rede)**:
   - Usa anúncios mock automaticamente
   - Não quebra a interface
   - Usuário não percebe o problema

**Exemplo de uso no código:**
```javascript
async function loadAdvertisements() {
  try {
    const response = await axios.get('/api/advertisements', {
      params: { position: 'left' }
    })
    slots.value = response.data
  } catch (error) {
    console.error('Erro ao carregar anúncios:', error)
    // Fallback para mocks
    slots.value = mockAdvertisements['left'] || []
  }
}
```

## 📈 Métricas e Analytics

Cada anúncio rastreia automaticamente:
- **Impressões**: Incrementado a cada busca da API
- **Cliques**: Incrementado quando usuário clica

Visualize no painel admin:
- Taxa de cliques (CTR)
- Performance por posição
- Anúncios mais efetivos

## 🎯 Boas Práticas

### Títulos
- ✅ Máximo 50 caracteres para melhor UX
- ✅ Use emojis para destaque (🎯 💎 🔒)
- ✅ Seja direto e claro

### Descrições
- ✅ 100-150 caracteres ideais
- ✅ Foque nos benefícios
- ✅ Call-to-action clara

### Posições
- **Left/Right Rail**: Conteúdo institucional, suporte
- **Home Featured**: Campanhas principais, destaques

### Slots
- Slot 1 = Topo (mais visível)
- Slots maiores = Abaixo
- Use para priorizar conteúdo

### Datas
- Configure datas para campanhas temporárias
- Deixe NULL para anúncios permanentes
- Sistema desativa automaticamente após end_date

## 🛠️ Troubleshooting

### Anúncios não aparecem

1. Verifique se estão ativos:
```sql
SELECT * FROM advertisements WHERE is_active = TRUE;
```

2. Verifique datas:
```sql
SELECT * FROM advertisements 
WHERE (start_date IS NULL OR start_date <= NOW())
  AND (end_date IS NULL OR end_date >= NOW());
```

3. Verifique posição:
```sql
SELECT * FROM advertisements WHERE position = 'left';
```

### Recriar anúncios de exemplo

```sql
DELETE FROM advertisements;
```

Depois execute `npm run db:seed` novamente.

### API retorna 404

- Verifique se o backend está rodando
- Confirme que a rota está registrada no `server.js`
- Veja logs do servidor para erros

## 🚀 Deploy em Produção

### Render.com

O seed NÃO roda automaticamente no deploy. Para popular em produção:

**Opção 1: Via Shell do Render**
```bash
cd backend
npm run db:seed
```

**Opção 2: Via Render Dashboard**
1. Vá em "Shell" no serviço backend
2. Execute: `npm run db:seed`

**Opção 3: Manualmente via PgAdmin**
- Conecte no banco PostgreSQL do Render
- Execute o SQL do arquivo seed

### Variáveis de Ambiente

Certifique-se que `DATABASE_URL` está configurada corretamente:
```
DATABASE_URL=postgres://user:password@host:port/database
```

## 📝 Schema da Tabela

```sql
CREATE TABLE advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    link_url VARCHAR(500),
    image_url VARCHAR(500),
    position VARCHAR(10) DEFAULT 'left', -- 'left', 'right', 'home_featured'
    slot INTEGER DEFAULT 1,              -- Ordem de exibição
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

## ✨ Conclusão

O sistema de anúncios está **100% funcional** e pronto para uso:
- ✅ API completa (pública + admin)
- ✅ Painel administrativo
- ✅ Sistema de fallback inteligente
- ✅ Métricas automáticas
- ✅ Seeds para popular dados

Para qualquer dúvida, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
