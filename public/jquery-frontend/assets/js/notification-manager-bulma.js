/**
 * NotificationManager - Sistema de notificações toast e badge
 * 
 * Features:
 * - Notificações toast (success, info, warning, error)
 * - Badge de contador em navbar
 * - Lista de notificações com dropdown
 * - Persistência no localStorage
 * - Auto-dismiss configurável
 * - Sons opcionais
 * 
 * @example
 * const notifications = new NotificationManager({
 *     position: 'top-right',
 *     duration: 5000,
 *     enableSound: true
 * });
 * 
 * notifications.success('Proposta enviada com sucesso!');
 * notifications.error('Erro ao processar pagamento');
 */

class NotificationManager {
    constructor(options = {}) {
        this.options = {
            position: 'top-right', // top-right, top-left, bottom-right, bottom-left
            duration: 5000,
            maxToasts: 3,
            storageKey: 'kadesh_notifications',
            badgeSelector: '#notificationBadge',
            dropdownSelector: '#notificationDropdown',
            enableSound: false,
            sounds: {
                success: '/kadesh/assets/sounds/success.mp3',
                error: '/kadesh/assets/sounds/error.mp3',
                warning: '/kadesh/assets/sounds/warning.mp3',
                info: '/kadesh/assets/sounds/info.mp3'
            },
            ...options
        };
        
        this.notifications = this.load();
        this.toastQueue = [];
        
        this.init();
    }
    
    /**
     * Inicializa o sistema de notificações
     */
    init() {
        this.createContainer();
        this.updateBadge();
        this.setupDropdown();
    }
    
    /**
     * Cria container para toasts
     */
    createContainer() {
        if ($('#toastContainer').length) return;
        
        const positions = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;'
        };
        
        const $container = $('<div>')
            .attr('id', 'toastContainer')
            .css({
                position: 'fixed',
                zIndex: 9999,
                ...this.parseStyle(positions[this.options.position])
            });
        
        $('body').append($container);
    }
    
    /**
     * Parse style string to object
     */
    parseStyle(styleString) {
        const styles = {};
        styleString.split(';').forEach(rule => {
            const [prop, value] = rule.split(':').map(s => s.trim());
            if (prop && value) {
                styles[prop] = value;
            }
        });
        return styles;
    }
    
    /**
     * Mostra toast de sucesso
     */
    success(message, title = 'Sucesso', options = {}) {
        return this.show(message, 'success', title, options);
    }
    
    /**
     * Mostra toast de erro
     */
    error(message, title = 'Erro', options = {}) {
        return this.show(message, 'danger', title, options);
    }
    
    /**
     * Mostra toast de aviso
     */
    warning(message, title = 'Atenção', options = {}) {
        return this.show(message, 'warning', title, options);
    }
    
    /**
     * Mostra toast de informação
     */
    info(message, title = 'Informação', options = {}) {
        return this.show(message, 'info', title, options);
    }
    
    /**
     * Mostra toast
     */
    show(message, type = 'info', title = '', options = {}) {
        const config = {
            duration: this.options.duration,
            dismissible: true,
            ...options
        };
        
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const icons = {
            success: 'check-circle',
            danger: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        const $toast = $(`
            <div class="notification is-${type} animate__animated animate__fadeInRight" 
                 id="${id}"
                 style="min-width: 300px; max-width: 400px; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                ${config.dismissible ? '<button class="delete"></button>' : ''}
                <div class="media">
                    <div class="media-left">
                        <span class="icon is-large">
                            <i class="fas fa-${icons[type]} fa-2x"></i>
                        </span>
                    </div>
                    <div class="media-content">
                        ${title ? `<p class="has-text-weight-bold">${title}</p>` : ''}
                        <p>${message}</p>
                    </div>
                </div>
            </div>
        `);
        
        // Limit toasts
        if (this.toastQueue.length >= this.options.maxToasts) {
            this.toastQueue[0].remove();
            this.toastQueue.shift();
        }
        
        $('#toastContainer').append($toast);
        this.toastQueue.push($toast);
        
        // Play sound
        if (this.options.enableSound) {
            this.playSound(type);
        }
        
        // Dismiss button
        $toast.find('.delete').on('click', () => {
            this.dismissToast($toast);
        });
        
        // Auto dismiss
        if (config.duration > 0) {
            setTimeout(() => {
                this.dismissToast($toast);
            }, config.duration);
        }
        
        // Add to persistent notifications if it's important
        if (options.persistent) {
            this.addNotification({
                id,
                type,
                title,
                message,
                timestamp: new Date().toISOString(),
                read: false
            });
        }
        
        return id;
    }
    
    /**
     * Dispensa toast
     */
    dismissToast($toast) {
        $toast.removeClass('animate__fadeInRight')
              .addClass('animate__fadeOutRight');
        
        setTimeout(() => {
            $toast.remove();
            const index = this.toastQueue.indexOf($toast);
            if (index > -1) {
                this.toastQueue.splice(index, 1);
            }
        }, 300);
    }
    
    /**
     * Adiciona notificação persistente
     */
    addNotification(notification) {
        this.notifications.unshift(notification);
        
        // Limit notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
        
        this.save();
        this.updateBadge();
        this.updateDropdown();
    }
    
    /**
     * Marca notificação como lida
     */
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.save();
            this.updateBadge();
            this.updateDropdown();
        }
    }
    
    /**
     * Marca todas como lidas
     */
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.save();
        this.updateBadge();
        this.updateDropdown();
    }
    
    /**
     * Remove notificação
     */
    removeNotification(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index > -1) {
            this.notifications.splice(index, 1);
            this.save();
            this.updateBadge();
            this.updateDropdown();
        }
    }
    
    /**
     * Limpa todas as notificações
     */
    clearAll() {
        this.notifications = [];
        this.save();
        this.updateBadge();
        this.updateDropdown();
    }
    
    /**
     * Obtém contagem de não lidas
     */
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }
    
    /**
     * Atualiza badge de contador
     */
    updateBadge() {
        const count = this.getUnreadCount();
        const $badge = $(this.options.badgeSelector);
        
        if ($badge.length) {
            if (count > 0) {
                $badge.text(count > 99 ? '99+' : count).show();
            } else {
                $badge.hide();
            }
        }
    }
    
    /**
     * Configura dropdown de notificações
     */
    setupDropdown() {
        this.updateDropdown();
        
        // Mark as read on click
        $(document).on('click', '.notification-item', (e) => {
            const id = $(e.currentTarget).data('id');
            this.markAsRead(id);
        });
        
        // Mark all as read
        $(document).on('click', '#markAllRead', () => {
            this.markAllAsRead();
        });
        
        // Clear all
        $(document).on('click', '#clearAllNotifications', () => {
            if (confirm('Deseja limpar todas as notificações?')) {
                this.clearAll();
            }
        });
    }
    
    /**
     * Atualiza dropdown de notificações
     */
    updateDropdown() {
        const $dropdown = $(this.options.dropdownSelector);
        if (!$dropdown.length) return;
        
        if (this.notifications.length === 0) {
            $dropdown.html(`
                <div class="dropdown-item has-text-centered has-text-grey">
                    <span class="icon"><i class="fas fa-inbox"></i></span>
                    <p class="mt-2">Nenhuma notificação</p>
                </div>
            `);
            return;
        }
        
        let html = '';
        
        // Show last 10 notifications
        this.notifications.slice(0, 10).forEach(n => {
            const icons = {
                success: 'check-circle has-text-success',
                danger: 'exclamation-circle has-text-danger',
                warning: 'exclamation-triangle has-text-warning',
                info: 'info-circle has-text-info'
            };
            
            const readClass = n.read ? 'has-background-white-ter' : '';
            const time = this.formatTime(n.timestamp);
            
            html += `
                <a class="dropdown-item notification-item ${readClass}" data-id="${n.id}">
                    <div class="media">
                        <div class="media-left">
                            <span class="icon">
                                <i class="fas fa-${icons[n.type]}"></i>
                            </span>
                        </div>
                        <div class="media-content">
                            <p class="is-size-7 has-text-weight-bold">${n.title}</p>
                            <p class="is-size-7">${n.message}</p>
                            <p class="is-size-7 has-text-grey">${time}</p>
                        </div>
                    </div>
                </a>
            `;
        });
        
        // Actions
        html += `
            <hr class="dropdown-divider">
            <div class="dropdown-item">
                <div class="buttons is-centered">
                    <button class="button is-small is-light" id="markAllRead">
                        <span class="icon is-small"><i class="fas fa-check-double"></i></span>
                        <span>Marcar todas como lidas</span>
                    </button>
                </div>
            </div>
        `;
        
        $dropdown.html(html);
    }
    
    /**
     * Formata timestamp
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes}min atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;
        
        return date.toLocaleDateString('pt-BR');
    }
    
    /**
     * Toca som de notificação
     */
    playSound(type) {
        if (!this.options.sounds[type]) return;
        
        const audio = new Audio(this.options.sounds[type]);
        audio.volume = 0.5;
        audio.play().catch(() => {
            // Ignore autoplay errors
        });
    }
    
    /**
     * Carrega notificações do localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.options.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading notifications:', error);
            return [];
        }
    }
    
    /**
     * Salva notificações no localStorage
     */
    save() {
        try {
            localStorage.setItem(this.options.storageKey, JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}
