/**
 * ThreeColumnFilters - Gerencia filtros e sidebar do layout de três colunas
 * 
 * Features:
 * - Filtros de categoria, preço, status e localização
 * - Persistência de filtros no localStorage
 * - Eventos para notificar mudanças
 * - Integração com AuctionCards
 * 
 * @example
 * const filters = new ThreeColumnFilters({
 *     categorySelector: '#category-filters',
 *     priceRangeSelector: '#priceRange',
 *     statusCheckboxes: 'input[type="checkbox"]',
 *     locationInput: 'input[placeholder="Cidade ou Estado"]',
 *     radiusSelector: '#radiusRange'
 * });
 * 
 * filters.on('filter-changed', (filters) => {
 *     console.log('Filters updated:', filters);
 *     auctionCards.applyFilters(filters);
 * });
 */

class ThreeColumnFilters {
    constructor(options = {}) {
        this.options = {
            categorySelector: '#category-filters',
            priceRangeSelector: '#priceRange',
            maxPriceDisplay: '#maxPriceDisplay',
            statusCheckboxes: '.box input[type="checkbox"]',
            locationInput: 'input[placeholder="Cidade ou Estado"]',
            radiusSelector: '#radiusRange',
            radiusDisplay: '#radiusDisplay',
            storageKey: 'kadesh_filters',
            ...options
        };
        
        this.filters = this.loadFilters();
        this.eventHandlers = {};
        
        this.init();
    }
    
    /**
     * Inicializa os filtros e event listeners
     */
    init() {
        this.setupCategoryFilters();
        this.setupPriceRangeFilter();
        this.setupStatusFilters();
        this.setupLocationFilter();
        this.setupRadiusFilter();
        
        // Restore saved filters
        this.applyFilters();
    }
    
    /**
     * Configura filtros de categoria
     */
    setupCategoryFilters() {
        const $categories = $(this.options.categorySelector).find('.category-item');
        
        $categories.on('click', (e) => {
            const $item = $(e.currentTarget);
            const category = $item.data('category');
            
            // Update active state
            $categories.removeClass('is-active');
            $item.addClass('is-active');
            
            // Update filter
            this.filters.category = category;
            this.saveFilters();
            this.emit('filter-changed', this.filters);
        });
    }
    
    /**
     * Configura filtro de faixa de preço
     */
    setupPriceRangeFilter() {
        const $priceRange = $(this.options.priceRangeSelector);
        const $maxDisplay = $(this.options.maxPriceDisplay);
        
        $priceRange.on('input', (e) => {
            const value = parseInt($(e.currentTarget).val());
            this.filters.maxPrice = value;
            
            // Update display
            $maxDisplay.val(this.formatCurrency(value));
            
            // Save and emit
            this.saveFilters();
            this.emit('filter-changed', this.filters);
        });
        
        // Set initial value
        if (this.filters.maxPrice) {
            $priceRange.val(this.filters.maxPrice);
            $maxDisplay.val(this.formatCurrency(this.filters.maxPrice));
        }
    }
    
    /**
     * Configura filtros de status
     */
    setupStatusFilters() {
        const $checkboxes = $(this.options.statusCheckboxes);
        
        $checkboxes.on('change', () => {
            const statuses = [];
            
            $checkboxes.each((index, checkbox) => {
                if ($(checkbox).is(':checked')) {
                    const label = $(checkbox).parent().text().trim();
                    statuses.push(label.toLowerCase());
                }
            });
            
            this.filters.statuses = statuses;
            this.saveFilters();
            this.emit('filter-changed', this.filters);
        });
    }
    
    /**
     * Configura filtro de localização
     */
    setupLocationFilter() {
        const $locationInput = $(this.options.locationInput);
        let timeout = null;
        
        $locationInput.on('input', (e) => {
            clearTimeout(timeout);
            
            timeout = setTimeout(() => {
                this.filters.location = $(e.currentTarget).val();
                this.saveFilters();
                this.emit('filter-changed', this.filters);
            }, 500); // Debounce 500ms
        });
        
        // Set initial value
        if (this.filters.location) {
            $locationInput.val(this.filters.location);
        }
    }
    
    /**
     * Configura filtro de raio de distância
     */
    setupRadiusFilter() {
        const $radiusRange = $(this.options.radiusSelector);
        const $radiusDisplay = $(this.options.radiusDisplay);
        
        $radiusRange.on('input', (e) => {
            const value = parseInt($(e.currentTarget).val());
            this.filters.radius = value;
            
            // Update display
            $radiusDisplay.text(value);
            
            // Save and emit
            this.saveFilters();
            this.emit('filter-changed', this.filters);
        });
        
        // Set initial value
        if (this.filters.radius) {
            $radiusRange.val(this.filters.radius);
            $radiusDisplay.text(this.filters.radius);
        }
    }
    
    /**
     * Carrega filtros do localStorage
     */
    loadFilters() {
        try {
            const saved = localStorage.getItem(this.options.storageKey);
            return saved ? JSON.parse(saved) : this.getDefaultFilters();
        } catch (error) {
            console.warn('Error loading filters:', error);
            return this.getDefaultFilters();
        }
    }
    
    /**
     * Salva filtros no localStorage
     */
    saveFilters() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(this.filters));
        } catch (error) {
            console.warn('Error saving filters:', error);
        }
    }
    
    /**
     * Retorna filtros padrão
     */
    getDefaultFilters() {
        return {
            category: 'all',
            maxPrice: 50000,
            statuses: ['aberto', 'encerrando em breve'],
            location: '',
            radius: 50
        };
    }
    
    /**
     * Aplica filtros salvos à UI
     */
    applyFilters() {
        // Category
        const $activeCategory = $(this.options.categorySelector)
            .find(`.category-item[data-category="${this.filters.category}"]`);
        
        if ($activeCategory.length) {
            $(this.options.categorySelector).find('.category-item').removeClass('is-active');
            $activeCategory.addClass('is-active');
        }
        
        // Price range
        if (this.filters.maxPrice) {
            $(this.options.priceRangeSelector).val(this.filters.maxPrice);
            $(this.options.maxPriceDisplay).val(this.formatCurrency(this.filters.maxPrice));
        }
        
        // Location
        if (this.filters.location) {
            $(this.options.locationInput).val(this.filters.location);
        }
        
        // Radius
        if (this.filters.radius) {
            $(this.options.radiusSelector).val(this.filters.radius);
            $(this.options.radiusDisplay).text(this.filters.radius);
        }
    }
    
    /**
     * Reseta todos os filtros
     */
    reset() {
        this.filters = this.getDefaultFilters();
        this.saveFilters();
        this.applyFilters();
        this.emit('filter-changed', this.filters);
    }
    
    /**
     * Obtém filtros atuais
     */
    getFilters() {
        return { ...this.filters };
    }
    
    /**
     * Define filtros programaticamente
     */
    setFilters(newFilters) {
        this.filters = { ...this.filters, ...newFilters };
        this.saveFilters();
        this.applyFilters();
        this.emit('filter-changed', this.filters);
    }
    
    /**
     * Formata valor como moeda brasileira
     */
    formatCurrency(value) {
        if (value >= 1000) {
            return `R$ ${(value / 1000).toFixed(0)}.000`;
        }
        return `R$ ${value}`;
    }
    
    /**
     * Registra event handler
     */
    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }
    
    /**
     * Remove event handler
     */
    off(event, handler) {
        if (!this.eventHandlers[event]) return;
        
        const index = this.eventHandlers[event].indexOf(handler);
        if (index > -1) {
            this.eventHandlers[event].splice(index, 1);
        }
    }
    
    /**
     * Emite evento
     */
    emit(event, data) {
        if (!this.eventHandlers[event]) return;
        
        this.eventHandlers[event].forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Error in ${event} handler:`, error);
            }
        });
    }
    
    /**
     * Destroi instância e limpa event listeners
     */
    destroy() {
        // Remove all event listeners
        $(this.options.categorySelector).find('.category-item').off('click');
        $(this.options.priceRangeSelector).off('input');
        $(this.options.statusCheckboxes).off('change');
        $(this.options.locationInput).off('input');
        $(this.options.radiusSelector).off('input');
        
        // Clear handlers
        this.eventHandlers = {};
    }
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThreeColumnFilters;
}
