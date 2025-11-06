# Plano de Migração e Aproveitamento do Antigo Sistema

## 📋 Sumário Executivo

Análise completa da pasta "antigo sistema" (WordPress/WooCommerce) identificando recursos aproveitáveis para o novo sistema Kadesh (PHP/MySQL/Bulma CSS).

**Data da Análise:** 06/11/2025  
**Responsável:** Marcus (Desenvolvedor)  
**Status:** Planejamento

---

## 🔍 Análise do Antigo Sistema

### Sistema Identificado
- **Plataforma:** WordPress 6.x com WooCommerce
- **Tema:** Hello Elementor + Taskbot (tema de marketplace/freelancer)
- **HTML Estático:** `kadeesh/index.html` - Protótipo Tailwind CSS com leilão reverso

### Estrutura Descoberta
```
antigo sistema/
├── wp-content/
│   ├── uploads/          # Imagens, logos, assets
│   │   ├── 2021-2025/   # Uploads organizados por ano
│   │   └── elementor/   # Assets do Elementor
│   ├── themes/
│   │   └── hello-elementor/
│   └── plugins/
└── kadeesh/
    └── index.html        # ⭐ Protótipo completo em Tailwind
```

---

## 🎨 Recursos Visuais Identificados

### 1. **Logos e Branding** ✅

#### Logo Principal Kaddesh (SVG)
- **Arquivo:** `wp-content/uploads/2023/09/logo-Kaddesh.svg`
- **Status:** ✅ Pronto para uso
- **Uso:** Header principal, favicon, emails

#### Variações de Logo
- **PNG Alta Resolução:** `wp-content/uploads/2024/07/logo-kaddesh.png` (original)
- **Favicon:** `wp-content/uploads/2023/09/cropped-fav_icon.png`
- **Versões Antigas:** Logo-01.jpg a Logo-04.jpg (2021/11)

### 2. **Imagens Header/Banner** ✅
- **Header-Image.png/jpg** (2022/06) - Várias resoluções
- **Header-Image-02-scaled.jpg** - Banner hero alternativo

### 3. **Icons e UI Elements** ✅
- **task-plan-icon.jpg** (2021/12)
- Logos TaskUp (dark/white) - Tema anterior

### 4. **Placeholders WooCommerce** ⚠️
- woocommerce-placeholder.png (várias resoluções)
- Útil para projetos sem imagem

---

## 💎 Análise do Protótipo HTML (kadeesh/index.html)

### **Funcionalidades Implementadas** ⭐

#### 1. **Sistema de Leilão Reverso Completo**
```javascript
// Características:
- Cards de leilão com countdown em tempo real
- Cálculo de score (70% preço + 30% reputação)
- Ordenação: score, preço, rating, tempo
- Modal de envio de lance
- Atualização dinâmica do menor lance
```

#### 2. **Layout e Design**
- **Framework:** Tailwind CSS 3.x (CDN)
- **Icons:** Font Awesome 6.5.2
- **Paleta de Cores:**
  - Primary: `#0f172a` (Slate escuro)
  - Secondary: `#ffffff`
  - Accent: `#ef4444` (Vermelho)
  - Background: `#f8fafc`

#### 3. **Componentes UI**
- Header responsivo com busca
- Sidebar de categorias (left)
- Sidebar de destaques (right)
- Cards de leilão com hover effects
- Modal de proposta
- Footer completo
- Menu mobile

#### 4. **Navegação SPA**
- Roteamento via hash (#home, #escopo, #cadastro)
- Alternância de views sem reload
- Active state nos links

#### 5. **Categorias de Serviços**
```
✅ 10 Categorias Implementadas:
1. Obras & Reformas
2. Pintura Predial
3. Elétrica
4. Hidráulica
5. Impermeabilização
6. HVAC / Climatização
7. Drywall & Forros
8. Energia Solar
9. Alvenaria
10. Telhados & Calhas
```

#### 6. **Fluxos de Negócio Documentados**
- Escopo completo do Contratante (14 etapas)
- Escopo completo do Contratado (11 etapas)
- Requisitos funcionais e técnicos
- KYC, Escrow, LGPD

---

## 🔄 Plano de Migração

### **FASE 1: Assets e Branding** 🎯
**Prioridade:** ALTA  
**Prazo:** 1 dia  
**Complexidade:** Baixa

#### Tarefas:
1. **Copiar Logos**
   ```bash
   # Origem → Destino
   antigo sistema/wp-content/uploads/2023/09/logo-Kaddesh.svg
   → public/assets/images/logo-kaddesh.svg
   
   antigo sistema/wp-content/uploads/2024/07/logo-kaddesh.png
   → public/assets/images/logo-kaddesh.png
   
   antigo sistema/wp-content/uploads/2023/09/cropped-fav_icon.png
   → public/assets/images/favicon.png
   ```

2. **Copiar Headers/Banners**
   ```bash
   antigo sistema/wp-content/uploads/2022/06/Header-Image.png
   → public/assets/images/hero-banner.png
   
   antigo sistema/wp-content/uploads/2022/06/Header-Image-02-scaled.jpg
   → public/assets/images/hero-banner-alt.jpg
   ```

3. **Atualizar Frontend Bulma**
   - Substituir placeholder logo no header
   - Adicionar favicon ao `<head>`
   - Usar hero-banner nas páginas principais

#### Critérios de Aceite:
- ✅ Logo Kaddesh aparece no header
- ✅ Favicon configurado e visível
- ✅ Banners hero em Home e Landing pages
- ✅ Identidade visual consistente

---

### **FASE 2: Componentes do Protótipo HTML** 🎯
**Prioridade:** ALTA  
**Prazo:** 3 dias  
**Complexidade:** Média

#### 2.1 **Sistema de Cards de Leilão**

**Criar:** `public/jquery-frontend/assets/js/auction-cards-bulma.js`

```javascript
// Funcionalidades a implementar:
1. Renderizar cards de leilão com:
   - Imagem do projeto
   - Título e descrição
   - Menor lance atual
   - Countdown em tempo real
   - Score (preço + reputação)
   - Barra de progresso do score
   
2. Ordenação dinâmica:
   - Por score (padrão)
   - Por menor preço
   - Por maior reputação
   - Por tempo restante
   
3. Animações:
   - Hover effect (translateY + shadow)
   - Atualização do countdown a cada segundo
   - Barra de score com animação
```

**Dados do Backend:**
```php
// Endpoint: GET /api/auctions/active
{
  "id": 1,
  "title": "Reforma elétrica predial — 3 andares",
  "description": "Projeto e execução (NR10/NR12)...",
  "image": "/storage/uploads/projeto-1.jpg",
  "lowest_bid": 18900.00,
  "bids_count": 12,
  "contractor": {
    "rating": 4.6,
    "projects_completed": 45
  },
  "bidding_ends_at": "2025-11-10T14:30:00",
  "status": "active"
}
```

#### 2.2 **Modal de Envio de Lance**

**Criar:** `public/jquery-frontend/components/bid-modal-bulma.html`

```html
<!-- Modal Bulma com:
- Título do projeto
- Campo: Valor do lance (R$)
- Campo: Disponibilidade (dias)
- Campo: Mensagem (textarea)
- Botão: Enviar proposta
- Validações JS
-->
```

**Backend Endpoint:**
```php
// POST /api/bids
{
  "project_id": 1,
  "bid_amount": 18200.00,
  "availability_days": 7,
  "message": "Equipe qualificada com NR10..."
}
```

#### 2.3 **Sistema de Categorias**

**Atualizar:** `public/jquery-frontend/home.html`

```html
<!-- Barra de categorias com icons Font Awesome -->
<div class="categories-bar">
  <a href="#" data-category="obras">
    <i class="fas fa-helmet-safety"></i>
    <span>Obras</span>
  </a>
  <!-- ... 9 outras categorias -->
</div>
```

**CSS Bulma:**
```css
.categories-bar {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0;
  border-bottom: 1px solid #dbdbdb;
}

.categories-bar a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #4a4a4a;
  transition: color 0.2s;
}

.categories-bar a:hover {
  color: #3273dc;
}
```

#### Critérios de Aceite:
- ✅ Cards de leilão renderizam com dados reais do backend
- ✅ Countdown atualiza a cada segundo
- ✅ Score calculado (70% preço + 30% reputação)
- ✅ Ordenação funciona (score, preço, rating, tempo)
- ✅ Modal de lance abre e fecha corretamente
- ✅ Envio de lance atualiza o card dinamicamente
- ✅ Barra de categorias navegável

---

### **FASE 3: Páginas de Escopo e Cadastro** 🎯
**Prioridade:** MÉDIA  
**Prazo:** 2 dias  
**Complexidade:** Baixa

#### 3.1 **Página de Escopo**

**Criar:** `public/jquery-frontend/escopo.html`

```html
<!-- Conteúdo do protótipo HTML seção "ESCOPO VIEW" -->
<!-- Adaptar para Bulma CSS -->
<div class="columns">
  <div class="column">
    <h3 class="title is-4">
      <i class="fas fa-briefcase"></i> Contratante
    </h3>
    <div class="timeline">
      <!-- 14 steps com ícones -->
    </div>
  </div>
  
  <div class="column">
    <h3 class="title is-4">
      <i class="fas fa-user-hard-hat"></i> Contratado
    </h3>
    <div class="timeline">
      <!-- 11 steps com ícones -->
    </div>
  </div>
</div>
```

**CSS Timeline:**
```css
.timeline .step {
  position: relative;
  padding-left: 2.25rem;
  padding-bottom: 1.5rem;
}

.timeline .step::before {
  content: "";
  position: absolute;
  left: 0.6rem;
  top: 0.35rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f14668;
  box-shadow: 0 0 0 4px rgba(241, 70, 104, 0.15);
}

.timeline .step::after {
  content: "";
  position: absolute;
  left: 1rem;
  top: 1.2rem;
  width: 2px;
  height: calc(100% - 1.2rem);
  background: #dbdbdb;
}

.timeline .step:last-child::after {
  display: none;
}
```

#### 3.2 **Página de Cadastro (Requisitos)**

**Criar:** `public/jquery-frontend/requisitos.html`

```html
<!-- Documentação técnica do protótipo -->
<!-- Seção "CADASTRO VIEW" adaptada para Bulma -->
<div class="box">
  <div class="content">
    <h3 class="title is-4">Cadastro — Requisitos funcionais e técnicos</h3>
    
    <div class="columns">
      <div class="column">
        <div class="notification is-info is-light">
          <p class="heading">Objetivo</p>
          <p>Marketplace unificado com leilão reverso...</p>
        </div>
      </div>
      
      <div class="column">
        <div class="notification is-success is-light">
          <p class="heading">Princípios</p>
          <ul>
            <li>Transparência: lances em tempo real</li>
            <li>Justiça: menor preço ponderado</li>
            <li>Segurança: KYC, escrow, LGPD</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Seções: Perfis, Campos, Demanda, Carteira, LGPD -->
  </div>
</div>
```

#### Critérios de Aceite:
- ✅ Página de escopo acessível via menu
- ✅ Timeline dos fluxos renderizada com ícones
- ✅ Página de requisitos formatada e legível
- ✅ Navegação entre páginas funcionando

---

### **FASE 4: Layout Three-Column** 🎯
**Prioridade:** BAIXA  
**Prazo:** 2 dias  
**Complexidade:** Média

#### Estrutura do Protótipo:
```
┌──────────┬──────────────────────┬──────────┐
│          │                      │          │
│ Sidebar  │   Content Main       │ Sidebar  │
│ Left     │   (Cards, Views)     │ Right    │
│          │                      │          │
│ (Categ)  │                      │ (Ads)    │
└──────────┴──────────────────────┴──────────┘
```

#### Implementação Bulma:

**Atualizar:** `public/jquery-frontend/dashboard.html`

```html
<div class="columns is-fullheight">
  <!-- Left Sidebar (hidden on mobile/tablet) -->
  <aside class="column is-2 is-hidden-mobile is-hidden-tablet-only">
    <div class="box">
      <button class="button is-danger is-fullwidth">
        <i class="fas fa-list"></i> Serviços
      </button>
      
      <aside class="menu">
        <ul class="menu-list">
          <li><a><i class="fas fa-helmet-safety"></i> Obras & Reformas</a></li>
          <li><a><i class="fas fa-brush"></i> Pintura Predial</a></li>
          <!-- ... outras categorias -->
        </ul>
      </aside>
    </div>
  </aside>
  
  <!-- Main Content -->
  <main class="column">
    <div id="content-root">
      <!-- Views dinâmicas (Home, Escopo, Cadastro) -->
    </div>
  </main>
  
  <!-- Right Sidebar (hidden on mobile/tablet) -->
  <aside class="column is-2 is-hidden-mobile is-hidden-tablet-only">
    <div class="box">
      <h3 class="title is-5">Empresas em Destaque</h3>
      <!-- Cards patrocinados -->
    </div>
    
    <div class="box">
      <h3 class="title is-5">Clientes em Destaque</h3>
      <!-- Cards patrocinados -->
    </div>
  </aside>
</div>
```

#### Critérios de Aceite:
- ✅ Layout three-column em desktop (>1024px)
- ✅ Sidebars escondem em mobile/tablet
- ✅ Content main ocupa 100% em telas pequenas
- ✅ Sidebars sticky (fixas no scroll)

---

### **FASE 5: Funcionalidades JavaScript** 🎯
**Prioridade:** ALTA  
**Prazo:** 3 dias  
**Complexidade:** Alta

#### 5.1 **Countdown Timer**

**Criar:** `public/jquery-frontend/assets/js/countdown-bulma.js`

```javascript
class AuctionCountdown {
  constructor(endDate, element) {
    this.endDate = new Date(endDate).getTime();
    this.element = element;
    this.interval = null;
  }
  
  start() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }
  
  update() {
    const now = Date.now();
    const diff = Math.max(this.endDate - now, 0);
    
    if (diff === 0) {
      this.element.textContent = 'ENCERRADO';
      this.element.classList.add('has-text-danger');
      clearInterval(this.interval);
      return;
    }
    
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    this.element.textContent = 
      `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  
  stop() {
    if (this.interval) clearInterval(this.interval);
  }
}

// Uso:
document.querySelectorAll('[data-countdown]').forEach(el => {
  const endDate = el.dataset.countdown;
  const countdown = new AuctionCountdown(endDate, el);
  countdown.start();
});
```

#### 5.2 **Score Calculator**

**Criar:** `public/jquery-frontend/assets/js/score-calculator-bulma.js`

```javascript
class ScoreCalculator {
  constructor(options = {}) {
    this.priceWeight = options.priceWeight || 0.7;
    this.reputationWeight = options.reputationWeight || 0.3;
  }
  
  calculate(price, rating, minPrice, maxPrice) {
    // Normalizar preço (menor = melhor)
    const priceIndex = maxPrice === minPrice 
      ? 1 
      : 1 - (price - minPrice) / (maxPrice - minPrice);
    
    // Normalizar rating (0-5 → 0-1)
    const reputationIndex = rating / 5;
    
    // Score final (0-100)
    const score = (this.priceWeight * priceIndex + this.reputationWeight * reputationIndex) * 100;
    
    return Math.round(score);
  }
  
  calculateForCards(cards) {
    const prices = cards.map(c => parseFloat(c.dataset.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    cards.forEach(card => {
      const price = parseFloat(card.dataset.price);
      const rating = parseFloat(card.dataset.rating || 4.5);
      
      const score = this.calculate(price, rating, minPrice, maxPrice);
      
      card.dataset.score = score;
      
      // Atualizar UI
      const scoreText = card.querySelector('.js-score');
      if (scoreText) scoreText.textContent = score;
      
      const scoreFill = card.querySelector('.js-score-fill');
      if (scoreFill) scoreFill.style.width = `${score}%`;
    });
  }
}

// Uso:
const calculator = new ScoreCalculator({
  priceWeight: 0.7,
  reputationWeight: 0.3
});

const cards = document.querySelectorAll('.auction-card');
calculator.calculateForCards(cards);
```

#### 5.3 **Dynamic Sorting**

**Criar:** `public/jquery-frontend/assets/js/auction-sorter-bulma.js`

```javascript
class AuctionSorter {
  constructor(containerSelector, selectSelector) {
    this.container = document.querySelector(containerSelector);
    this.select = document.querySelector(selectSelector);
    
    this.select.addEventListener('change', (e) => {
      this.sort(e.target.value);
    });
  }
  
  sort(mode) {
    const cards = Array.from(this.container.querySelectorAll('.auction-card'));
    
    cards.sort((a, b) => {
      switch (mode) {
        case 'price':
          return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        
        case 'rating':
          return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
        
        case 'time':
          const dateA = new Date(a.dataset.endDate).getTime();
          const dateB = new Date(b.dataset.endDate).getTime();
          return dateA - dateB;
        
        case 'score':
        default:
          return parseFloat(b.dataset.score || 0) - parseFloat(a.dataset.score || 0);
      }
    });
    
    // Reordenar no DOM
    cards.forEach(card => this.container.appendChild(card));
  }
}

// Uso:
const sorter = new AuctionSorter('#auction-cards-grid', '#sort-select');
sorter.sort('score'); // Ordenação inicial
```

#### 5.4 **SPA Routing**

**Criar:** `public/jquery-frontend/assets/js/router-bulma.js`

```javascript
class SPARouter {
  constructor(contentRoot) {
    this.contentRoot = document.querySelector(contentRoot);
    this.currentView = null;
    
    // Event listeners
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
        }
        
        const view = link.dataset.nav;
        if (view) this.showView(view);
      });
    });
    
    // Handle hash change
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      this.showView(hash);
    });
    
    // Initial load
    window.addEventListener('load', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      this.showView(hash);
    });
  }
  
  showView(view) {
    // Esconder todas as views
    document.querySelectorAll('[data-view]').forEach(v => {
      v.classList.add('is-hidden');
    });
    
    // Mostrar view selecionada
    const targetView = document.querySelector(`[data-view="${view}"]`);
    if (targetView) {
      targetView.classList.remove('is-hidden');
    }
    
    // Atualizar active state dos links
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.classList.remove('is-active', 'has-text-danger');
    });
    
    document.querySelectorAll(`[data-nav="${view}"]`).forEach(link => {
      link.classList.add('is-active', 'has-text-danger');
    });
    
    // Atualizar hash
    window.location.hash = view;
    this.currentView = view;
  }
}

// Uso:
const router = new SPARouter('#content-root');
```

#### Critérios de Aceite:
- ✅ Countdown atualiza a cada segundo até encerrar
- ✅ Score calculado corretamente (70/30 ou customizado)
- ✅ Ordenação reordena cards sem reload
- ✅ SPA routing funciona com hash navigation
- ✅ Active state dos links atualiza corretamente

---

### **FASE 6: Integração Backend** 🎯
**Prioridade:** ALTA  
**Prazo:** 4 dias  
**Complexidade:** Alta

#### 6.1 **Endpoints Backend Necessários**

**Criar:** `src/Backend/Controllers/AuctionController.php`

```php
<?php
namespace Kadesh\Backend\Controllers;

class AuctionController {
    
    /**
     * GET /api/auctions/active
     * Lista leilões ativos com filtros
     */
    public function active() {
        $category = $_GET['category'] ?? null;
        $sort = $_GET['sort'] ?? 'score';
        
        // Buscar projetos em leilão (status = 'open')
        // Calcular: bids_count, lowest_bid, contractor_rating
        // Ordenar por: score, price, rating, time
        
        return $this->json([
            'auctions' => $auctions,
            'total' => $total,
            'weights' => [
                'price' => 0.7,
                'reputation' => 0.3
            ]
        ]);
    }
    
    /**
     * GET /api/auctions/:id/details
     * Detalhes completos do leilão
     */
    public function details($id) {
        // Incluir: project, contractor, bids[], timeline[], attachments[]
    }
    
    /**
     * GET /api/auctions/:id/leaderboard
     * Ranking ao vivo de propostas
     */
    public function leaderboard($id) {
        // Retornar top 10 propostas ordenadas por score
        // Incluir: provider, bid_amount, availability, rating, score
    }
}
```

**Criar:** `src/Backend/Models/Auction.php`

```php
<?php
namespace Kadesh\Backend\Models;

class Auction {
    
    /**
     * Buscar leilões ativos com estatísticas
     */
    public static function findActive($filters = []) {
        $sql = "
            SELECT 
                p.*,
                u.name as contractor_name,
                u.rating as contractor_rating,
                COUNT(b.id) as bids_count,
                MIN(b.amount) as lowest_bid,
                (SELECT COUNT(*) FROM project_views WHERE project_id = p.id) as views_count
            FROM projects p
            INNER JOIN users u ON p.contractor_id = u.id
            LEFT JOIN bids b ON p.id = b.project_id
            WHERE p.status = 'open'
            AND p.bidding_ends_at > NOW()
        ";
        
        // Aplicar filtros (category, keyword, location)
        // GROUP BY p.id
        // ORDER BY ...
        
        return $results;
    }
    
    /**
     * Calcular score ponderado
     */
    public static function calculateScore($price, $rating, $minPrice, $maxPrice, $weights = null) {
        $weights = $weights ?? ['price' => 0.7, 'reputation' => 0.3];
        
        $priceIndex = ($maxPrice === $minPrice) 
            ? 1 
            : 1 - ($price - $minPrice) / ($maxPrice - $minPrice);
        
        $reputationIndex = $rating / 5;
        
        $score = ($weights['price'] * $priceIndex + $weights['reputation'] * $reputationIndex) * 100;
        
        return round($score, 2);
    }
}
```

#### 6.2 **Routes**

**Atualizar:** `public/backend.php`

```php
// Auctions
if ($path === '/api/auctions/active' && $method === 'GET') {
    echo $auctionController->active();
}

if (preg_match('#^/api/auctions/(\d+)/details$#', $path, $matches) && $method === 'GET') {
    echo $auctionController->details($matches[1]);
}

if (preg_match('#^/api/auctions/(\d+)/leaderboard$#', $path, $matches) && $method === 'GET') {
    echo $auctionController->leaderboard($matches[1]);
}
```

#### 6.3 **Integração Frontend**

**Atualizar:** `public/jquery-frontend/assets/js/auctions-bulma.js`

```javascript
// Carregar leilões ativos
async function loadActiveAuctions(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/kadesh/api/auctions/active?${params}`);
    const data = await response.json();
    
    renderAuctionCards(data.auctions);
    
    // Inicializar countdown e score
    initializeCountdowns();
    calculateScores(data.weights);
    
  } catch (error) {
    console.error('Erro ao carregar leilões:', error);
    showNotification('Erro ao carregar leilões', 'is-danger');
  }
}

// Renderizar cards
function renderAuctionCards(auctions) {
  const grid = document.querySelector('#auction-cards-grid');
  grid.innerHTML = '';
  
  auctions.forEach(auction => {
    const card = createAuctionCard(auction);
    grid.appendChild(card);
  });
}

// Criar card HTML
function createAuctionCard(auction) {
  const card = document.createElement('div');
  card.className = 'column is-one-quarter-desktop is-one-third-tablet is-half-mobile';
  card.dataset.price = auction.lowest_bid || auction.max_budget;
  card.dataset.rating = auction.contractor_rating;
  card.dataset.endDate = auction.bidding_ends_at;
  card.dataset.projectId = auction.id;
  
  card.innerHTML = `
    <div class="card auction-card">
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="${auction.image || '/kadesh/assets/images/project-placeholder.jpg'}" alt="${auction.title}">
        </figure>
        <div class="auction-badge">LANCE REVERSO</div>
        <div class="rating-badge">
          <i class="fas fa-star"></i> ${auction.contractor_rating}
        </div>
      </div>
      
      <div class="card-content">
        <h4 class="title is-5">${auction.title}</h4>
        <p class="content">${auction.description.substring(0, 80)}...</p>
        
        <div class="columns is-mobile">
          <div class="column">
            <p class="heading">Menor lance</p>
            <p class="title is-6">R$ <span class="js-price">${formatCurrency(auction.lowest_bid)}</span></p>
          </div>
          <div class="column">
            <p class="heading">Tempo restante</p>
            <p class="title is-6 js-countdown" data-countdown="${auction.bidding_ends_at}">--:--:--</p>
          </div>
        </div>
        
        <div class="score-container">
          <div class="score-label">
            <span>Placar (70% preço + 30% reputação)</span>
            <span class="score-value"><span class="js-score">0</span>%</span>
          </div>
          <progress class="progress is-danger js-score-bar" value="0" max="100">0%</progress>
        </div>
        
        <button class="button is-danger is-fullwidth" onclick="openBidModal(${auction.id})">
          <i class="fas fa-gavel"></i> Dar meu lance
        </button>
      </div>
    </div>
  `;
  
  return card;
}

// Inicializar ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  loadActiveAuctions();
});
```

#### Critérios de Aceite:
- ✅ Endpoint `/api/auctions/active` retorna JSON com leilões
- ✅ Frontend carrega e renderiza cards com dados reais
- ✅ Countdown funciona com data do backend
- ✅ Score calculado com dados reais (preço + rating)
- ✅ Ordenação atualiza com dados corretos
- ✅ Erro de rede tratado com notificação

---

## 📊 Resumo das Fases

| Fase | Descrição | Prioridade | Prazo | Arquivos |
|------|-----------|------------|-------|----------|
| **1** | Assets e Branding | ALTA | 1 dia | 5 imagens |
| **2** | Componentes do Protótipo | ALTA | 3 dias | 3 JS + 1 HTML |
| **3** | Páginas Escopo/Cadastro | MÉDIA | 2 dias | 2 HTML + CSS |
| **4** | Layout Three-Column | BAIXA | 2 dias | 1 HTML + CSS |
| **5** | Funcionalidades JS | ALTA | 3 dias | 4 JS modules |
| **6** | Integração Backend | ALTA | 4 dias | 2 Controllers + 1 Model |
| **TOTAL** | | | **15 dias** | **23 arquivos** |

---

## 🎯 Próximos Passos Imediatos

### 1. **Copiar Assets (Hoje)** ✅
```powershell
# Executar agora:
New-Item -Path "public/assets/images" -ItemType Directory -Force

Copy-Item "antigo sistema/wp-content/uploads/2023/09/logo-Kaddesh.svg" `
          "public/assets/images/logo-kaddesh.svg"

Copy-Item "antigo sistema/wp-content/uploads/2024/07/logo-kaddesh.png" `
          "public/assets/images/logo-kaddesh.png"

Copy-Item "antigo sistema/wp-content/uploads/2023/09/cropped-fav_icon.png" `
          "public/assets/images/favicon.png"
```

### 2. **Atualizar Header com Logo (Hoje)** ✅
```html
<!-- public/jquery-frontend/index.html -->
<nav class="navbar">
  <div class="navbar-brand">
    <a class="navbar-item" href="#home">
      <img src="/kadesh/assets/images/logo-kaddesh.svg" alt="Kaddesh" height="40">
      <span class="ml-2 title is-4">Kaddesh</span>
    </a>
  </div>
</nav>

<!-- Adicionar favicon no <head> -->
<link rel="icon" type="image/png" href="/kadesh/assets/images/favicon.png">
```

### 3. **Criar Estrutura de Arquivos JS (Amanhã)** 📁
```powershell
New-Item "public/jquery-frontend/assets/js/auction-cards-bulma.js" -ItemType File
New-Item "public/jquery-frontend/assets/js/countdown-bulma.js" -ItemType File
New-Item "public/jquery-frontend/assets/js/score-calculator-bulma.js" -ItemType File
New-Item "public/jquery-frontend/assets/js/auction-sorter-bulma.js" -ItemType File
New-Item "public/jquery-frontend/assets/js/router-bulma.js" -ItemType File
```

### 4. **Implementar Backend Auctions (Esta Semana)** 🚀
```powershell
New-Item "src/Backend/Controllers/AuctionController.php" -ItemType File
New-Item "src/Backend/Models/Auction.php" -ItemType File
```

---

## 🔧 Dependências e Bibliotecas

### Já Disponíveis:
- ✅ Bulma CSS 0.9.4
- ✅ jQuery 3.7.1
- ✅ Font Awesome 6.4.0
- ✅ Chart.js (para gráficos)

### A Adicionar:
```html
<!-- Adicionar ao <head> para melhor compatibilidade -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

<!-- Number formatting -->
<script src="https://cdn.jsdelivr.net/npm/numeral@2.0.6/numeral.min.js"></script>
```

---

## 📝 Notas Técnicas

### Diferenças Tailwind → Bulma

| Tailwind CSS | Bulma CSS | Uso |
|--------------|-----------|-----|
| `flex items-center` | `is-flex is-align-items-center` | Flexbox |
| `grid grid-cols-4` | `columns` + `column is-one-quarter` | Grid |
| `bg-red-500` | `has-background-danger` | Background |
| `text-white` | `has-text-white` | Text color |
| `rounded-lg` | `box` ou `card` | Arredondamento |
| `shadow-md` | `box` (já inclui) | Sombra |

### Score Calculation Details

**Fórmula do Protótipo:**
```
priceIndex = 1 - (price - minPrice) / (maxPrice - minPrice)
reputationIndex = rating / 5
score = (0.7 * priceIndex + 0.3 * reputationIndex) * 100
```

**Exemplo:**
```
Projeto A: R$ 18.900, Rating 4.6
Projeto B: R$ 17.490, Rating 4.9
Projeto C: R$ 11.800, Rating 4.0

minPrice = 11.800
maxPrice = 18.900

Score A = (0.7 * 0 + 0.3 * 0.92) * 100 = 27.6%
Score B = (0.7 * 0.19 + 0.3 * 0.98) * 100 = 42.7%
Score C = (0.7 * 1 + 0.3 * 0.80) * 100 = 94.0% ⭐
```

---

## ✅ Checklist Final

### Antes de Começar:
- [ ] Backup da pasta `antigo sistema` criado
- [ ] Branch Git criada: `feature/migration-old-system`
- [ ] Equipe alinhada sobre escopo e prazos

### Durante Implementação:
- [ ] Commits frequentes com mensagens descritivas
- [ ] Testes manuais após cada fase
- [ ] Screenshots de progresso salvos
- [ ] Documentação inline no código

### Após Conclusão:
- [ ] Todos os assets copiados e funcionando
- [ ] Todos os componentes JS implementados
- [ ] Backend integrado e testado
- [ ] Páginas de escopo/cadastro finalizadas
- [ ] Layout responsivo em mobile/tablet/desktop
- [ ] Testes E2E (Playwright) atualizados
- [ ] Pull Request criado com descrição completa
- [ ] Code review realizado
- [ ] Merge na branch principal

---

## 🚀 Resultado Esperado

Ao final desta migração, teremos:

1. ✅ **Identidade Visual Profissional**
   - Logo Kaddesh SVG no header
   - Favicon configurado
   - Banners hero de alta qualidade

2. ✅ **Sistema de Leilão Reverso Funcional**
   - Cards de projetos com dados reais
   - Countdown em tempo real
   - Cálculo de score (preço + reputação)
   - Ordenação dinâmica
   - Modal de envio de lance

3. ✅ **Páginas Informativas**
   - Escopo completo (14 steps Contratante + 11 steps Contratado)
   - Requisitos técnicos documentados
   - FAQ e Como funciona

4. ✅ **Layout Profissional**
   - Three-column layout (desktop)
   - Sidebar de categorias (left)
   - Sidebar de destaques (right)
   - Responsivo (mobile/tablet/desktop)

5. ✅ **Arquitetura Moderna**
   - SPA routing com hash navigation
   - Módulos JavaScript separados
   - Backend API RESTful
   - Clean code e documentado

---

## 📞 Contato e Suporte

**Desenvolvedor:** Marcus  
**Data de Criação:** 06/11/2025  
**Última Atualização:** 06/11/2025  
**Versão:** 1.0

---

**Status do Plano:** ✅ PRONTO PARA EXECUÇÃO  
**Próxima Ação:** Copiar assets (Fase 1) e atualizar header com logo
