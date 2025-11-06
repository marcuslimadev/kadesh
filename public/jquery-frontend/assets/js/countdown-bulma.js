/**
 * Countdown Timer para Leilões
 * Sistema de contagem regressiva em tempo real
 */

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
      this.element.classList.add('has-text-danger', 'has-text-weight-bold');
      clearInterval(this.interval);
      
      // Disparar evento de encerramento
      const event = new CustomEvent('auction-ended', {
        detail: { element: this.element }
      });
      document.dispatchEvent(event);
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Formato: HH:MM:SS ou DD:HH:MM se > 24h
    let timeString;
    if (days > 0) {
      timeString = `${days}d ${String(hours).padStart(2, '0')}h`;
    } else {
      timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    this.element.textContent = timeString;
    
    // Mudar cor conforme urgência
    if (diff < 3600000) { // < 1 hora
      this.element.classList.add('has-text-danger');
    } else if (diff < 86400000) { // < 24 horas
      this.element.classList.add('has-text-warning');
    } else {
      this.element.classList.add('has-text-info');
    }
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

// Inicializar todos os countdowns na página
function initializeCountdowns() {
  const countdownElements = document.querySelectorAll('[data-countdown]');
  const countdowns = [];
  
  countdownElements.forEach(element => {
    const endDate = element.dataset.countdown;
    if (endDate) {
      const countdown = new AuctionCountdown(endDate, element);
      countdown.start();
      countdowns.push(countdown);
    }
  });
  
  return countdowns;
}

// Parar todos os countdowns (útil ao trocar de página)
function stopAllCountdowns(countdowns) {
  if (countdowns && Array.isArray(countdowns)) {
    countdowns.forEach(countdown => countdown.stop());
  }
}

// Exportar para uso global
window.AuctionCountdown = AuctionCountdown;
window.initializeCountdowns = initializeCountdowns;
window.stopAllCountdowns = stopAllCountdowns;
