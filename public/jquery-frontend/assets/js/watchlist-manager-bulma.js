/**
 * WatchlistManager - Gerencia lista de favoritos/watchlist de leilões
 * 
 * Features:
 * - Adicionar/remover projetos da watchlist
 * - Persistência no localStorage
 * - Contador de itens
 * - Notificações de mudanças
 * - Sincronização com UI (ícone de estrela)
 * 
 * @example
 * const watchlist = new WatchlistManager({
 *     storageKey: 'kadesh_watchlist',
 *     maxItems: 50
 * });
 * 
 * watchlist.add(projectId, projectData);
 * watchlist.on('added', (project) => {
 *     console.log('Added to watchlist:', project);
 * });
 */

class WatchlistManager {
    constructor(options = {}) {
        this.options = {
            storageKey: 'kadesh_watchlist',
            maxItems: 50,
            autoSync: true,
            ...options
        };
        
        this.items = this.load();
        this.eventHandlers = {};
        
        if (this.options.autoSync) {
            this.setupAutoSync();
        }
    }
    
    /**
     * Adiciona projeto à watchlist
     */
    add(projectId, projectData = {}) {
        if (this.has(projectId)) {
            console.warn('Project already in watchlist:', projectId);
            return false;
        }
        
        if (this.items.length >= this.options.maxItems) {
            this.emit('limit-reached', { max: this.options.maxItems });
            return false;
        }
        
        const item = {
            id: projectId,
            addedAt: new Date().toISOString(),
            ...projectData
        };
        
        this.items.push(item);
        this.save();
        this.emit('added', item);
        this.emit('changed', this.items);
        
        return true;
    }
    
    /**
     * Remove projeto da watchlist
     */
    remove(projectId) {
        const index = this.items.findIndex(item => item.id === projectId);
        
        if (index === -1) {
            console.warn('Project not in watchlist:', projectId);
            return false;
        }
        
        const removed = this.items.splice(index, 1)[0];
        this.save();
        this.emit('removed', removed);
        this.emit('changed', this.items);
        
        return true;
    }
    
    /**
     * Toggle projeto na watchlist
     */
    toggle(projectId, projectData = {}) {
        if (this.has(projectId)) {
            return this.remove(projectId);
        } else {
            return this.add(projectId, projectData);
        }
    }
    
    /**
     * Verifica se projeto está na watchlist
     */
    has(projectId) {
        return this.items.some(item => item.id === projectId);
    }
    
    /**
     * Obtém todos os itens
     */
    getAll() {
        return [...this.items];
    }
    
    /**
     * Obtém item específico
     */
    get(projectId) {
        return this.items.find(item => item.id === projectId);
    }
    
    /**
     * Obtém contagem de itens
     */
    count() {
        return this.items.length;
    }
    
    /**
     * Limpa toda a watchlist
     */
    clear() {
        this.items = [];
        this.save();
        this.emit('cleared');
        this.emit('changed', this.items);
    }
    
    /**
     * Atualiza dados de um item
     */
    update(projectId, updates) {
        const item = this.get(projectId);
        
        if (!item) {
            console.warn('Project not in watchlist:', projectId);
            return false;
        }
        
        Object.assign(item, updates);
        this.save();
        this.emit('updated', item);
        this.emit('changed', this.items);
        
        return true;
    }
    
    /**
     * Carrega watchlist do localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.options.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading watchlist:', error);
            return [];
        }
    }
    
    /**
     * Salva watchlist no localStorage
     */
    save() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving watchlist:', error);
        }
    }
    
    /**
     * Configura sincronização automática entre abas
     */
    setupAutoSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.options.storageKey) {
                this.items = this.load();
                this.emit('synced', this.items);
                this.emit('changed', this.items);
            }
        });
    }
    
    /**
     * Exporta watchlist como JSON
     */
    export() {
        return JSON.stringify(this.items, null, 2);
    }
    
    /**
     * Importa watchlist de JSON
     */
    import(json) {
        try {
            const items = JSON.parse(json);
            
            if (!Array.isArray(items)) {
                throw new Error('Invalid format');
            }
            
            this.items = items;
            this.save();
            this.emit('imported', this.items);
            this.emit('changed', this.items);
            
            return true;
        } catch (error) {
            console.error('Error importing watchlist:', error);
            return false;
        }
    }
    
    /**
     * Renderiza botão de watchlist
     */
    renderButton(projectId, projectData = {}) {
        const isWatched = this.has(projectId);
        const iconClass = isWatched ? 'fas fa-star' : 'far fa-star';
        const buttonClass = isWatched ? 'is-warning' : 'is-light';
        const text = isWatched ? 'Favorito' : 'Favoritar';
        
        return `
            <button class="button ${buttonClass} watchlist-btn" 
                    data-project-id="${projectId}"
                    data-project-data='${JSON.stringify(projectData)}'>
                <span class="icon">
                    <i class="${iconClass}"></i>
                </span>
                <span>${text}</span>
            </button>
        `;
    }
    
    /**
     * Inicializa event listeners para botões de watchlist
     */
    initializeButtons() {
        $(document).off('click', '.watchlist-btn');
        
        $(document).on('click', '.watchlist-btn', (e) => {
            e.preventDefault();
            const $btn = $(e.currentTarget);
            const projectId = $btn.data('project-id');
            const projectData = $btn.data('project-data');
            
            this.toggle(projectId, projectData);
            
            // Update button
            this.updateButton($btn, projectId);
        });
    }
    
    /**
     * Atualiza aparência do botão
     */
    updateButton($btn, projectId) {
        const isWatched = this.has(projectId);
        const $icon = $btn.find('i');
        const $text = $btn.find('span:last');
        
        if (isWatched) {
            $btn.removeClass('is-light').addClass('is-warning');
            $icon.removeClass('far').addClass('fas');
            $text.text('Favorito');
        } else {
            $btn.removeClass('is-warning').addClass('is-light');
            $icon.removeClass('fas').addClass('far');
            $text.text('Favoritar');
        }
        
        // Animation
        $btn.addClass('animate__animated animate__pulse animate__faster');
        setTimeout(() => {
            $btn.removeClass('animate__animated animate__pulse animate__faster');
        }, 500);
    }
    
    /**
     * Atualiza todos os botões na página
     */
    updateAllButtons() {
        $('.watchlist-btn').each((index, btn) => {
            const $btn = $(btn);
            const projectId = $btn.data('project-id');
            this.updateButton($btn, projectId);
        });
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
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WatchlistManager;
}
