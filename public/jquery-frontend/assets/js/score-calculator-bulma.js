/**
 * Score Calculator para Sistema de Leilão Reverso
 * Calcula score ponderado: 70% preço + 30% reputação (customizável)
 */

class ScoreCalculator {
  constructor(options = {}) {
    this.priceWeight = options.priceWeight || 0.7;
    this.reputationWeight = options.reputationWeight || 0.3;
  }
  
  /**
   * Calcula score individual
   * @param {number} price - Preço do lance
   * @param {number} rating - Rating do provedor (0-5)
   * @param {number} minPrice - Menor preço da lista
   * @param {number} maxPrice - Maior preço da lista
   * @returns {number} Score de 0 a 100
   */
  calculate(price, rating, minPrice, maxPrice) {
    // Normalizar preço (menor = melhor, então invertemos)
    const priceIndex = maxPrice === minPrice 
      ? 1 
      : 1 - (price - minPrice) / (maxPrice - minPrice);
    
    // Normalizar rating (0-5 → 0-1)
    const reputationIndex = rating / 5;
    
    // Score final (0-100)
    const score = (this.priceWeight * priceIndex + this.reputationWeight * reputationIndex) * 100;
    
    return Math.round(score);
  }
  
  /**
   * Calcula scores para todos os cards
   * @param {Array<HTMLElement>} cards - Array de elementos card
   */
  calculateForCards(cards) {
    if (!cards || cards.length === 0) return;
    
    const prices = cards.map(c => parseFloat(c.dataset.price || 0)).filter(p => p > 0);
    
    if (prices.length === 0) return;
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    cards.forEach(card => {
      const price = parseFloat(card.dataset.price || 0);
      const rating = parseFloat(card.dataset.rating || 4.5);
      
      if (price === 0) return;
      
      const score = this.calculate(price, rating, minPrice, maxPrice);
      
      // Armazenar score no card
      card.dataset.score = score;
      
      // Atualizar UI - texto do score
      const scoreText = card.querySelector('.js-score');
      if (scoreText) {
        scoreText.textContent = score;
      }
      
      // Atualizar UI - barra de progresso
      const scoreBar = card.querySelector('.js-score-bar');
      if (scoreBar) {
        scoreBar.value = score;
        scoreBar.textContent = `${score}%`;
        
        // Cor da barra baseada no score
        scoreBar.classList.remove('is-success', 'is-warning', 'is-danger');
        if (score >= 80) {
          scoreBar.classList.add('is-success');
        } else if (score >= 50) {
          scoreBar.classList.add('is-warning');
        } else {
          scoreBar.classList.add('is-danger');
        }
      }
      
      // Atualizar UI - fill da barra (estilo customizado)
      const scoreFill = card.querySelector('.js-score-fill');
      if (scoreFill) {
        scoreFill.style.width = `${score}%`;
      }
    });
  }
  
  /**
   * Atualiza os pesos do cálculo
   */
  setWeights(priceWeight, reputationWeight) {
    // Validar que soma = 1
    const sum = priceWeight + reputationWeight;
    if (Math.abs(sum - 1) > 0.01) {
      console.warn('Pesos devem somar 1.0. Normalizando...');
      this.priceWeight = priceWeight / sum;
      this.reputationWeight = reputationWeight / sum;
    } else {
      this.priceWeight = priceWeight;
      this.reputationWeight = reputationWeight;
    }
  }
  
  /**
   * Retorna os pesos atuais
   */
  getWeights() {
    return {
      price: this.priceWeight,
      reputation: this.reputationWeight
    };
  }
}

// Instância global
window.scoreCalculator = new ScoreCalculator();

// Função helper para recalcular scores
window.recalculateScores = function(containerSelector = '.auction-cards-grid') {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const cards = Array.from(container.querySelectorAll('.auction-card'));
  window.scoreCalculator.calculateForCards(cards);
};
