/**
 * Auction Sorter - Sistema de Ordenação de Leilões
 * Ordena cards por: score, preço, rating, tempo restante
 */

class AuctionSorter {
  constructor(containerSelector, selectSelector) {
    this.container = document.querySelector(containerSelector);
    this.select = document.querySelector(selectSelector);
    
    if (!this.container) {
      console.error('Container não encontrado:', containerSelector);
      return;
    }
    
    if (this.select) {
      this.select.addEventListener('change', (e) => {
        this.sort(e.target.value);
      });
    }
  }
  
  /**
   * Ordena os cards
   * @param {string} mode - Modo de ordenação: score, price, rating, time
   */
  sort(mode = 'score') {
    if (!this.container) return;
    
    const cards = Array.from(this.container.querySelectorAll('.auction-card'));
    
    if (cards.length === 0) return;
    
    // Função de comparação baseada no modo
    cards.sort((a, b) => {
      switch (mode) {
        case 'price':
          // Menor preço primeiro
          return this.getPrice(a) - this.getPrice(b);
        
        case 'rating':
          // Maior rating primeiro
          return this.getRating(b) - this.getRating(a);
        
        case 'time':
          // Menor tempo restante primeiro
          return this.getTimeRemaining(a) - this.getTimeRemaining(b);
        
        case 'score':
        default:
          // Maior score primeiro
          return this.getScore(b) - this.getScore(a);
      }
    });
    
    // Reordenar no DOM
    cards.forEach(card => {
      this.container.appendChild(card);
    });
    
    // Animação suave
    this.container.classList.add('is-sorting');
    setTimeout(() => {
      this.container.classList.remove('is-sorting');
    }, 300);
    
    // Disparar evento
    const event = new CustomEvent('auctions-sorted', {
      detail: { mode, count: cards.length }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Helpers para extrair valores dos cards
   */
  getPrice(card) {
    return parseFloat(card.dataset.price || card.querySelector('.js-price')?.dataset.value || 0);
  }
  
  getRating(card) {
    return parseFloat(card.dataset.rating || 0);
  }
  
  getScore(card) {
    return parseFloat(card.dataset.score || 0);
  }
  
  getTimeRemaining(card) {
    const endDate = card.dataset.endDate || card.querySelector('[data-countdown]')?.dataset.countdown;
    if (!endDate) return Infinity;
    
    const end = new Date(endDate).getTime();
    const now = Date.now();
    return Math.max(end - now, 0);
  }
  
  /**
   * Retorna modo atual
   */
  getCurrentMode() {
    return this.select ? this.select.value : 'score';
  }
  
  /**
   * Define modo de ordenação
   */
  setMode(mode) {
    if (this.select) {
      this.select.value = mode;
    }
    this.sort(mode);
  }
}

// CSS para animação de sorting
const sortingStyles = `
  .is-sorting {
    opacity: 0.7;
    pointer-events: none;
  }
`;

// Adicionar estilos
if (!document.getElementById('auction-sorter-styles')) {
  const style = document.createElement('style');
  style.id = 'auction-sorter-styles';
  style.textContent = sortingStyles;
  document.head.appendChild(style);
}

// Exportar
window.AuctionSorter = AuctionSorter;
