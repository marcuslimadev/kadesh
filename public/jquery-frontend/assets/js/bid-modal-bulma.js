/**
 * Bid Modal - Modal de Envio de Lance
 * Interface para criar e enviar propostas
 */

class BidModal {
  constructor(modalSelector = '#bid-modal') {
    this.modal = document.querySelector(modalSelector);
    this.currentProjectId = null;
    this.currentProjectTitle = '';
    
    if (this.modal) {
      this.initializeElements();
      this.attachEvents();
    } else {
      console.warn('Modal de lance não encontrado:', modalSelector);
    }
  }
  
  initializeElements() {
    this.closeButtons = this.modal.querySelectorAll('.modal-close, .modal-background, [data-action="close-modal"]');
    this.form = this.modal.querySelector('#bid-form');
    this.submitButton = this.modal.querySelector('[data-action="submit-bid"]');
    
    // Campos do formulário
    this.projectTitleEl = this.modal.querySelector('#modal-project-title');
    this.bidAmountInput = this.modal.querySelector('#bid-amount');
    this.availabilityInput = this.modal.querySelector('#bid-availability');
    this.messageInput = this.modal.querySelector('#bid-message');
    this.attachmentsInput = this.modal.querySelector('#bid-attachments');
  }
  
  attachEvents() {
    // Fechar modal
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });
    
    // Submit do formulário
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submit();
      });
    }
    
    // Validação em tempo real
    if (this.bidAmountInput) {
      this.bidAmountInput.addEventListener('input', () => this.validateAmount());
    }
    
    if (this.availabilityInput) {
      this.availabilityInput.addEventListener('input', () => this.validateAvailability());
    }
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-active')) {
        this.close();
      }
    });
  }
  
  /**
   * Abre o modal para um projeto
   */
  open(projectId, projectTitle, currentBid = null) {
    if (!this.modal) return;
    
    this.currentProjectId = projectId;
    this.currentProjectTitle = projectTitle;
    
    // Atualizar título
    if (this.projectTitleEl) {
      this.projectTitleEl.textContent = projectTitle;
    }
    
    // Sugerir lance menor se houver lance atual
    if (currentBid && this.bidAmountInput) {
      const suggestedBid = parseFloat(currentBid) - 100;
      this.bidAmountInput.placeholder = `Ex: R$ ${suggestedBid.toFixed(2)}`;
      this.bidAmountInput.dataset.currentBid = currentBid;
    }
    
    // Resetar formulário
    if (this.form) {
      this.form.reset();
    }
    
    this.clearErrors();
    this.modal.classList.add('is-active');
    
    // Focar no primeiro campo
    setTimeout(() => {
      if (this.bidAmountInput) {
        this.bidAmountInput.focus();
      }
    }, 100);
  }
  
  /**
   * Fecha o modal
   */
  close() {
    if (!this.modal) return;
    
    this.modal.classList.remove('is-active');
    this.currentProjectId = null;
    this.currentProjectTitle = '';
    
    if (this.form) {
      this.form.reset();
    }
    
    this.clearErrors();
  }
  
  /**
   * Valida valor do lance
   */
  validateAmount() {
    const amount = parseFloat(this.bidAmountInput.value);
    const currentBid = parseFloat(this.bidAmountInput.dataset.currentBid || 0);
    
    this.clearError(this.bidAmountInput);
    
    if (isNaN(amount) || amount <= 0) {
      this.showError(this.bidAmountInput, 'Informe um valor válido');
      return false;
    }
    
    if (currentBid > 0 && amount >= currentBid) {
      this.showError(this.bidAmountInput, 
        `Seu lance deve ser menor que R$ ${currentBid.toFixed(2)}`);
      return false;
    }
    
    if (amount < 100) {
      this.showError(this.bidAmountInput, 'Valor mínimo: R$ 100,00');
      return false;
    }
    
    return true;
  }
  
  /**
   * Valida disponibilidade
   */
  validateAvailability() {
    const days = parseInt(this.availabilityInput.value);
    
    this.clearError(this.availabilityInput);
    
    if (isNaN(days) || days <= 0) {
      this.showError(this.availabilityInput, 'Informe um prazo válido');
      return false;
    }
    
    if (days > 365) {
      this.showError(this.availabilityInput, 'Prazo máximo: 365 dias');
      return false;
    }
    
    return true;
  }
  
  /**
   * Envia o lance
   */
  async submit() {
    if (!this.validateAmount() || !this.validateAvailability()) {
      return;
    }
    
    // Desabilitar botão
    if (this.submitButton) {
      this.submitButton.classList.add('is-loading');
      this.submitButton.disabled = true;
    }
    
    try {
      const formData = {
        project_id: this.currentProjectId,
        amount: parseFloat(this.bidAmountInput.value),
        proposal: this.messageInput?.value || '',
        delivery_time_days: parseInt(this.availabilityInput.value)
      };

      const response = await fetch('/kadesh/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Importante para enviar cookies de sessão
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar lance');
      }
      
      // Sucesso
      this.showSuccess(data.message || 'Lance enviado com sucesso!');
      
      // Fechar modal após 2s
      setTimeout(() => {
        this.close();
        
        // Recarregar leilões se houver instância
        if (window.auctionCards) {
          window.auctionCards.load();
        }
      }, 2000);
      
      // Disparar evento
      const event = new CustomEvent('bid-submitted', {
        detail: { bid: data.bid, project: this.currentProjectId }
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Erro ao enviar lance:', error);
      this.showError(this.form, error.message);
    } finally {
      // Reabilitar botão
      if (this.submitButton) {
        this.submitButton.classList.remove('is-loading');
        this.submitButton.disabled = false;
      }
    }
  }
  
  /**
   * Mostra erro em campo específico
   */
  showError(element, message) {
    if (!element) return;
    
    element.classList.add('is-danger');
    
    // Criar ou atualizar mensagem de erro
    let help = element.parentElement.querySelector('.help.is-danger');
    if (!help) {
      help = document.createElement('p');
      help.className = 'help is-danger';
      element.parentElement.appendChild(help);
    }
    help.textContent = message;
  }
  
  /**
   * Limpa erro de campo específico
   */
  clearError(element) {
    if (!element) return;
    
    element.classList.remove('is-danger');
    
    const help = element.parentElement.querySelector('.help.is-danger');
    if (help) {
      help.remove();
    }
  }
  
  /**
   * Limpa todos os erros
   */
  clearErrors() {
    if (!this.modal) return;
    
    this.modal.querySelectorAll('.is-danger').forEach(el => {
      el.classList.remove('is-danger');
    });
    
    this.modal.querySelectorAll('.help.is-danger').forEach(el => {
      el.remove();
    });
  }
  
  /**
   * Mostra mensagem de sucesso
   */
  showSuccess(message) {
    if (!this.modal) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification is-success is-light';
    notification.innerHTML = `
      <button class="delete"></button>
      <strong>Sucesso!</strong> ${message}
    `;
    
    const content = this.modal.querySelector('.modal-card-body');
    if (content) {
      content.insertBefore(notification, content.firstChild);
      
      notification.querySelector('.delete').addEventListener('click', () => {
        notification.remove();
      });
    }
  }
}

// Função global para abrir modal
window.openBidModal = function(projectId, projectTitle = '', currentBid = null) {
  if (!window.bidModal) {
    window.bidModal = new BidModal('#bid-modal');
  }
  
  // Buscar título do projeto se não fornecido
  if (!projectTitle) {
    const card = document.querySelector(`[data-project-id="${projectId}"]`);
    if (card) {
      projectTitle = card.querySelector('.title')?.textContent || 'Projeto';
      const priceEl = card.querySelector('.js-price');
      currentBid = priceEl?.dataset.value || null;
    }
  }
  
  window.bidModal.open(projectId, projectTitle, currentBid);
};

// Exportar
window.BidModal = BidModal;
