/**
 * ResponsiveLayout - Gerencia comportamento responsivo do layout de três colunas
 * 
 * Features:
 * - Detecta breakpoints (mobile, tablet, desktop)
 * - Toggle de sidebars em mobile/tablet
 * - Sticky positioning com scroll suave
 * - Animações de transição
 * 
 * @example
 * const layout = new ResponsiveLayout({
 *     leftSidebar: '.sidebar-left',
 *     rightSidebar: '.sidebar-right',
 *     mainContent: '.main-content',
 *     mobileBreakpoint: 1024
 * });
 */

class ResponsiveLayout {
    constructor(options = {}) {
        this.options = {
            leftSidebar: '.sidebar-left',
            rightSidebar: '.sidebar-right',
            mainContent: '.main-content',
            mobileBreakpoint: 1024,
            toggleButtons: {
                left: '#toggleLeftSidebar',
                right: '#toggleRightSidebar'
            },
            ...options
        };
        
        this.state = {
            isMobile: false,
            leftSidebarVisible: true,
            rightSidebarVisible: true
        };
        
        this.init();
    }
    
    /**
     * Inicializa o layout responsivo
     */
    init() {
        this.checkBreakpoint();
        this.setupEventListeners();
        this.createToggleButtons();
        
        // Check on resize with debounce
        let resizeTimeout;
        $(window).on('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.checkBreakpoint(), 200);
        });
    }
    
    /**
     * Verifica breakpoint atual
     */
    checkBreakpoint() {
        const width = $(window).width();
        const wasMobile = this.state.isMobile;
        this.state.isMobile = width <= this.options.mobileBreakpoint;
        
        if (wasMobile !== this.state.isMobile) {
            this.handleBreakpointChange();
        }
    }
    
    /**
     * Manipula mudança de breakpoint
     */
    handleBreakpointChange() {
        if (this.state.isMobile) {
            this.enterMobileMode();
        } else {
            this.exitMobileMode();
        }
    }
    
    /**
     * Entra em modo mobile
     */
    enterMobileMode() {
        // Hide sidebars by default on mobile
        $(this.options.leftSidebar).addClass('is-hidden-mobile');
        $(this.options.rightSidebar).addClass('is-hidden-mobile');
        
        // Show toggle buttons
        $(this.options.toggleButtons.left).removeClass('is-hidden');
        $(this.options.toggleButtons.right).removeClass('is-hidden');
        
        this.state.leftSidebarVisible = false;
        this.state.rightSidebarVisible = false;
    }
    
    /**
     * Sai do modo mobile
     */
    exitMobileMode() {
        // Show sidebars on desktop
        $(this.options.leftSidebar).removeClass('is-hidden-mobile');
        $(this.options.rightSidebar).removeClass('is-hidden-mobile');
        
        // Hide toggle buttons
        $(this.options.toggleButtons.left).addClass('is-hidden');
        $(this.options.toggleButtons.right).addClass('is-hidden');
        
        this.state.leftSidebarVisible = true;
        this.state.rightSidebarVisible = true;
    }
    
    /**
     * Cria botões de toggle para sidebars
     */
    createToggleButtons() {
        // Left sidebar toggle
        if (!$(this.options.toggleButtons.left).length) {
            const $leftBtn = $('<button>')
                .attr('id', 'toggleLeftSidebar')
                .addClass('button is-primary is-hidden')
                .html('<span class="icon"><i class="fas fa-filter"></i></span><span>Filtros</span>')
                .css({
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 30,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                });
            
            $('body').append($leftBtn);
        }
        
        // Right sidebar toggle
        if (!$(this.options.toggleButtons.right).length) {
            const $rightBtn = $('<button>')
                .attr('id', 'toggleRightSidebar')
                .addClass('button is-info is-hidden')
                .html('<span class="icon"><i class="fas fa-star"></i></span><span>Destaques</span>')
                .css({
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 30,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                });
            
            $('body').append($rightBtn);
        }
    }
    
    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Left sidebar toggle
        $(document).on('click', this.options.toggleButtons.left, () => {
            this.toggleSidebar('left');
        });
        
        // Right sidebar toggle
        $(document).on('click', this.options.toggleButtons.right, () => {
            this.toggleSidebar('right');
        });
        
        // Close sidebars when clicking outside in mobile
        $(document).on('click', (e) => {
            if (!this.state.isMobile) return;
            
            const $target = $(e.target);
            const isLeftSidebar = $target.closest(this.options.leftSidebar).length > 0;
            const isRightSidebar = $target.closest(this.options.rightSidebar).length > 0;
            const isToggleButton = $target.closest(this.options.toggleButtons.left).length > 0 ||
                                   $target.closest(this.options.toggleButtons.right).length > 0;
            
            if (!isLeftSidebar && !isRightSidebar && !isToggleButton) {
                this.closeSidebars();
            }
        });
    }
    
    /**
     * Toggle sidebar específica
     */
    toggleSidebar(side) {
        if (side === 'left') {
            this.state.leftSidebarVisible = !this.state.leftSidebarVisible;
            
            if (this.state.leftSidebarVisible) {
                $(this.options.leftSidebar)
                    .removeClass('is-hidden-mobile')
                    .addClass('animate__animated animate__fadeInLeft animate__faster');
                
                // Hide right sidebar
                if (this.state.rightSidebarVisible) {
                    this.toggleSidebar('right');
                }
            } else {
                $(this.options.leftSidebar).addClass('is-hidden-mobile');
            }
        } else if (side === 'right') {
            this.state.rightSidebarVisible = !this.state.rightSidebarVisible;
            
            if (this.state.rightSidebarVisible) {
                $(this.options.rightSidebar)
                    .removeClass('is-hidden-mobile')
                    .addClass('animate__animated animate__fadeInRight animate__faster');
                
                // Hide left sidebar
                if (this.state.leftSidebarVisible) {
                    this.toggleSidebar('left');
                }
            } else {
                $(this.options.rightSidebar).addClass('is-hidden-mobile');
            }
        }
    }
    
    /**
     * Fecha todas as sidebars
     */
    closeSidebars() {
        if (this.state.leftSidebarVisible) {
            this.toggleSidebar('left');
        }
        
        if (this.state.rightSidebarVisible) {
            this.toggleSidebar('right');
        }
    }
    
    /**
     * Obtém estado atual
     */
    getState() {
        return { ...this.state };
    }
    
    /**
     * Scroll suave para elemento
     */
    scrollToElement(selector, offset = 70) {
        const $element = $(selector);
        
        if ($element.length) {
            $('html, body').animate({
                scrollTop: $element.offset().top - offset
            }, 500);
        }
    }
    
    /**
     * Ajusta altura das sidebars
     */
    adjustSidebarHeights() {
        const windowHeight = $(window).height();
        const navbarHeight = $('.navbar').outerHeight() || 52;
        const maxHeight = windowHeight - navbarHeight - 40; // 40px padding
        
        $(this.options.leftSidebar).css('max-height', `${maxHeight}px`);
        $(this.options.rightSidebar).css('max-height', `${maxHeight}px`);
    }
    
    /**
     * Destroi instância
     */
    destroy() {
        $(window).off('resize');
        $(document).off('click', this.options.toggleButtons.left);
        $(document).off('click', this.options.toggleButtons.right);
        $(this.options.toggleButtons.left).remove();
        $(this.options.toggleButtons.right).remove();
    }
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveLayout;
}
