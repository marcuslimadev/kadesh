/**
 * Auction Cards - Sistema de Renderização de Cards de Leilão
 * Carrega e renderiza cards de leilões ativos
 */

class AuctionCards {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
  apiEndpoint: options.apiEndpoint || '/kadesh/api/auctions/active',
      autoLoad: options.autoLoad !== false,
      autoRefresh: options.autoRefresh || 30000, // 30s
      ...options
    };
    
    this.auctions = [];
    this.countdowns = [];
    this.sorter = null;
    this.refreshInterval = null;
    
    if (this.container && this.options.autoLoad) {
      this.load();
    }
  }
  
  /**
   * Carrega leilões da API
   */
  async load(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const url = `${this.options.apiEndpoint}?${params}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Verificar se há erro na resposta
      if (data.error) {
        throw new Error(data.message || 'Erro ao carregar leilões');
      }
      
      // Dados podem vir em data.auctions ou diretamente
      this.auctions = data.auctions || data.data || data;
      
      // Renderizar
      this.render();
      
      // Inicializar funcionalidades
      this.initializeCountdowns();
      this.calculateScores(data.weights);
      this.initializeSorter();
      
      // Auto refresh
      if (this.options.autoRefresh && !this.refreshInterval) {
        this.refreshInterval = setInterval(() => {
          this.load(filters);
        }, this.options.autoRefresh);
      }
      
      return this.auctions;
      
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
      this.showError(error.message);
      return [];
    }
  }
  
  /**
   * Renderiza os cards
   */
  render() {
    if (!this.container) return;
    
    // Limpar container
    this.container.innerHTML = '';
    
    if (this.auctions.length === 0) {
      this.showEmpty();
      return;
    }
    
    // Criar cards
    this.auctions.forEach(auction => {
      const card = this.createCard(auction);
      this.container.appendChild(card);
    });
  }
  
  /**
   * Cria um card HTML
   */
  createCard(auction) {
    const column = document.createElement('div');
    column.className = 'column is-one-quarter-desktop is-one-third-tablet is-half-mobile';
    
    const lowestBid = auction.lowest_bid || auction.max_budget || 0;
    const rating = auction.contractor_rating || auction.rating || 4.5;
    const image = auction.image || auction.attachments?.[0] || '/kadesh/assets/images/project-placeholder.png';
    
    column.innerHTML = `
      <div class="card auction-card" 
           data-price="${lowestBid}" 
           data-rating="${rating}" 
           data-end-date="${auction.bidding_ends_at}"
           data-project-id="${auction.id}">
        
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="${image}" alt="${this.escapeHtml(auction.title)}">
          </figure>
          
          <div class="tags has-addons" style="position: absolute; top: 0.5rem; left: 0.5rem;">
            <span class="tag is-danger has-text-weight-bold">LANCE REVERSO</span>
          </div>
          
          <div class="tags has-addons" style="position: absolute; top: 0.5rem; right: 0.5rem;">
            <span class="tag is-warning">
              <i class="fas fa-star mr-1"></i>
              ${rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <div class="card-content">
          <h4 class="title is-5 mb-3">${this.escapeHtml(auction.title)}</h4>
          <p class="content has-text-grey mb-4">
            ${this.escapeHtml(this.truncate(auction.description, 100))}
          </p>
          
          <div class="columns is-mobile mb-3">
            <div class="column">
              <p class="heading mb-1">Menor lance</p>
              <p class="title is-6 has-text-success">
                <span class="js-price" data-value="${lowestBid}">
                  R$ ${this.formatCurrency(lowestBid)}
                </span>
              </p>
            </div>
            <div class="column">
              <p class="heading mb-1">Tempo restante</p>
              <p class="title is-6 js-countdown" data-countdown="${auction.bidding_ends_at}">
                --:--:--
              </p>
            </div>
          </div>
          
          <div class="mb-3">
            <div class="level is-mobile mb-1">
              <div class="level-left">
                <div class="level-item">
                  <small class="has-text-grey">
                    Placar (${Math.round((auction.price_weight || 0.7) * 100)}% preço + 
                    ${Math.round((auction.reputation_weight || 0.3) * 100)}% reputação)
                  </small>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <strong class="js-score">0</strong>%
                </div>
              </div>
            </div>
            <progress class="progress is-danger js-score-bar" value="0" max="100">0%</progress>
          </div>
          
          <div class="level is-mobile mb-2">
            <div class="level-left">
              <div class="level-item">
                <small class="has-text-grey">
                  <i class="fas fa-eye mr-1"></i>
                  ${auction.views_count || 0} visualizações
                </small>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <small class="has-text-grey">
                  <i class="fas fa-gavel mr-1"></i>
                  ${auction.bids_count || 0} propostas
                </small>
              </div>
            </div>
          </div>
          
          <button class="button is-danger is-fullwidth" onclick="openBidModal(${auction.id})">
            <span class="icon">
              <i class="fas fa-gavel"></i>
            </span>
            <span>Dar meu lance</span>
          </button>
        </div>
      </div>
    `;
    
    return column;
  }
  
  /**
   * Inicializa countdowns
   */
  initializeCountdowns() {
    // Parar countdowns anteriores
    if (this.countdowns.length > 0) {
      this.countdowns.forEach(c => c.stop());
    }
    
    this.countdowns = window.initializeCountdowns ? window.initializeCountdowns() : [];
  }
  
  /**
   * Calcula scores
   */
  calculateScores(weights = null) {
    if (weights && window.scoreCalculator) {
      window.scoreCalculator.setWeights(weights.price || 0.7, weights.reputation || 0.3);
    }
    
    if (window.recalculateScores) {
      window.recalculateScores(this.container.classList[0] || '.auction-cards-grid');
    }
  }
  
  /**
   * Inicializa sorter
   */
  initializeSorter() {
    const selectId = this.options.sortSelectId || '#sort-select';
    const containerClass = '.' + (this.container.classList[0] || 'auction-cards-grid');
    
    if (document.querySelector(selectId)) {
      this.sorter = new window.AuctionSorter(containerClass, selectId);
      this.sorter.sort('score'); // Ordenação inicial
    }
  }
  
  /**
   * Mostra mensagem de erro
   */
  showError(message) {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="column is-full">
        <article class="message is-danger">
          <div class="message-header">
            <p>Erro ao carregar leilões</p>
          </div>
          <div class="message-body">
            ${this.escapeHtml(message)}
            <br><br>
            <button class="button is-danger is-outlined" onclick="location.reload()">
              <span class="icon"><i class="fas fa-refresh"></i></span>
              <span>Tentar novamente</span>
            </button>
          </div>
        </article>
      </div>
    `;
  }
  
  /**
   * Mostra mensagem de vazio
   */
  showEmpty() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="column is-full">
        <div class="notification is-info is-light">
          <div class="has-text-centered py-6">
            <span class="icon is-large has-text-info mb-3">
              <i class="fas fa-inbox fa-3x"></i>
            </span>
            <h3 class="title is-4">Nenhum leilão ativo no momento</h3>
            <p class="subtitle is-6 has-text-grey">
              Volte em breve ou crie um novo projeto para receber propostas.
            </p>
            <a href="#create-project" class="button is-primary mt-4">
              <span class="icon"><i class="fas fa-plus"></i></span>
              <span>Criar Projeto</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Helpers
   */
  formatCurrency(value) {
    return parseFloat(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  truncate(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Cleanup
   */
  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.countdowns.length > 0) {
      this.countdowns.forEach(c => c.stop());
    }
  }
}

// Exportar
window.AuctionCards = AuctionCards;
