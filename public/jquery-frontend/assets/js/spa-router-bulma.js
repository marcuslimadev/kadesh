/**
 * SPARouter - Single Page Application Router para navegação hash-based
 * 
 * Features:
 * - Roteamento baseado em hash (#/page)
 * - Carregamento dinâmico de conteúdo
 * - Histórico do navegador
 * - Middleware para autenticação
 * - Transições animadas
 * - Fallback para 404
 * 
 * @example
 * const router = new SPARouter({
 *     container: '#app',
 *     defaultRoute: 'auctions',
 *     routes: {
 *         'auctions': { 
 *             template: '/pages/auctions.html',
 *             title: 'Leilões Ativos'
 *         },
 *         'project/:id': {
 *             template: '/pages/project-details.html',
 *             title: 'Detalhes do Projeto',
 *             requiresAuth: true
 *         }
 *     }
 * });
 */

class SPARouter {
    constructor(options = {}) {
        this.options = {
            container: '#app',
            defaultRoute: 'home',
            baseUrl: '/kadesh/jquery-frontend',
            routes: {},
            notFoundTemplate: '/pages/404.html',
            loadingTemplate: '<div class="has-text-centered p-6"><span class="icon is-large has-text-primary"><i class="fas fa-spinner fa-pulse fa-2x"></i></span></div>',
            transitionDuration: 300,
            ...options
        };
        
        this.currentRoute = null;
        this.params = {};
        this.queryParams = {};
        this.middleware = [];
        this.beforeHooks = [];
        this.afterHooks = [];
        
        this.init();
    }
    
    /**
     * Inicializa o router
     */
    init() {
        // Listen to hash changes
        $(window).on('hashchange', () => this.handleRouteChange());
        
        // Listen to link clicks
        $(document).on('click', 'a[href^="#/"]', (e) => {
            e.preventDefault();
            const hash = $(e.currentTarget).attr('href');
            this.navigate(hash.substring(2)); // Remove #/
        });
        
        // Initial route
        this.handleRouteChange();
    }
    
    /**
     * Registra rota
     */
    route(path, config) {
        this.options.routes[path] = config;
        return this;
    }
    
    /**
     * Registra múltiplas rotas
     */
    routes(routes) {
        Object.assign(this.options.routes, routes);
        return this;
    }
    
    /**
     * Navega para rota específica
     */
    navigate(path, replace = false) {
        const hash = `#/${path}`;
        
        if (replace) {
            window.location.replace(hash);
        } else {
            window.location.hash = hash;
        }
    }
    
    /**
     * Volta para rota anterior
     */
    back() {
        window.history.back();
    }
    
    /**
     * Manipula mudança de rota
     */
    async handleRouteChange() {
        const hash = window.location.hash.substring(2) || this.options.defaultRoute; // Remove #/
        const { route, params, queryParams } = this.matchRoute(hash);
        
        if (!route) {
            this.render404();
            return;
        }
        
        // Store params
        this.params = params;
        this.queryParams = queryParams;
        
        // Run before hooks
        const shouldContinue = await this.runBeforeHooks(route, params);
        if (!shouldContinue) return;
        
        // Check authentication
        if (route.requiresAuth && !this.isAuthenticated()) {
            this.navigate('login', true);
            return;
        }
        
        // Run middleware
        const middlewarePassed = await this.runMiddleware(route, params);
        if (!middlewarePassed) return;
        
        // Update title
        if (route.title) {
            document.title = `${route.title} - Kadesh`;
        }
        
        // Render route
        await this.render(route, params);
        
        // Store current route
        this.currentRoute = { path: hash, route, params, queryParams };
        
        // Run after hooks
        await this.runAfterHooks(route, params);
    }
    
    /**
     * Busca rota correspondente
     */
    matchRoute(path) {
        // Extract query parameters
        const [pathname, search] = path.split('?');
        const queryParams = this.parseQueryString(search);
        
        // Try exact match first
        if (this.options.routes[pathname]) {
            return { 
                route: this.options.routes[pathname], 
                params: {}, 
                queryParams 
            };
        }
        
        // Try pattern matching
        for (const [pattern, route] of Object.entries(this.options.routes)) {
            const params = this.matchPattern(pattern, pathname);
            
            if (params) {
                return { route, params, queryParams };
            }
        }
        
        return { route: null, params: {}, queryParams };
    }
    
    /**
     * Verifica se padrão corresponde ao caminho
     */
    matchPattern(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        
        if (patternParts.length !== pathParts.length) {
            return null;
        }
        
        const params = {};
        
        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];
            
            if (patternPart.startsWith(':')) {
                // Parameter
                const paramName = patternPart.substring(1);
                params[paramName] = pathPart;
            } else if (patternPart !== pathPart) {
                // Mismatch
                return null;
            }
        }
        
        return params;
    }
    
    /**
     * Parse query string
     */
    parseQueryString(search) {
        if (!search) return {};
        
        const params = {};
        const pairs = search.split('&');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        
        return params;
    }
    
    /**
     * Renderiza rota
     */
    async render(route, params) {
        const $container = $(this.options.container);
        
        // Show loading
        $container.html(this.options.loadingTemplate);
        
        try {
            let content;
            
            if (route.template) {
                // Load template
                const templateUrl = this.options.baseUrl + route.template;
                content = await this.loadTemplate(templateUrl);
            } else if (route.component) {
                // Render component
                content = await route.component(params);
            } else if (route.render) {
                // Custom render function
                content = await route.render(params);
            }
            
            // Fade out
            $container.fadeOut(this.options.transitionDuration / 2, () => {
                // Set content
                $container.html(content);
                
                // Fade in
                $container.fadeIn(this.options.transitionDuration / 2);
                
                // Run onEnter hook
                if (route.onEnter) {
                    route.onEnter(params);
                }
                
                // Scroll to top
                window.scrollTo(0, 0);
            });
            
        } catch (error) {
            console.error('Error rendering route:', error);
            this.render404();
        }
    }
    
    /**
     * Carrega template via AJAX
     */
    async loadTemplate(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                method: 'GET',
                dataType: 'html',
                success: (data) => resolve(data),
                error: (xhr, status, error) => reject(error)
            });
        });
    }
    
    /**
     * Renderiza página 404
     */
    render404() {
        const $container = $(this.options.container);
        
        const content = `
            <div class="section">
                <div class="container has-text-centered">
                    <span class="icon is-large has-text-grey-light mb-4" style="font-size: 5rem;">
                        <i class="fas fa-triangle-exclamation"></i>
                    </span>
                    <h1 class="title is-1">404</h1>
                    <p class="subtitle is-4">Página não encontrada</p>
                    <a href="#/auctions" class="button is-primary mt-4">
                        <span class="icon"><i class="fas fa-home"></i></span>
                        <span>Voltar para Leilões</span>
                    </a>
                </div>
            </div>
        `;
        
        $container.html(content);
    }
    
    /**
     * Adiciona middleware
     */
    use(fn) {
        this.middleware.push(fn);
        return this;
    }
    
    /**
     * Executa middleware
     */
    async runMiddleware(route, params) {
        for (const fn of this.middleware) {
            const result = await fn(route, params, this);
            if (result === false) return false;
        }
        return true;
    }
    
    /**
     * Adiciona before hook
     */
    beforeEach(fn) {
        this.beforeHooks.push(fn);
        return this;
    }
    
    /**
     * Executa before hooks
     */
    async runBeforeHooks(route, params) {
        for (const fn of this.beforeHooks) {
            const result = await fn(route, params, this);
            if (result === false) return false;
        }
        return true;
    }
    
    /**
     * Adiciona after hook
     */
    afterEach(fn) {
        this.afterHooks.push(fn);
        return this;
    }
    
    /**
     * Executa after hooks
     */
    async runAfterHooks(route, params) {
        for (const fn of this.afterHooks) {
            await fn(route, params, this);
        }
    }
    
    /**
     * Verifica se usuário está autenticado
     */
    isAuthenticated() {
        // TODO: Implement real authentication check
        const user = localStorage.getItem('kadesh_user');
        return !!user;
    }
    
    /**
     * Obtém rota atual
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
    
    /**
     * Obtém parâmetros da rota
     */
    getParams() {
        return { ...this.params };
    }
    
    /**
     * Obtém query parameters
     */
    getQueryParams() {
        return { ...this.queryParams };
    }
    
    /**
     * Destroi router
     */
    destroy() {
        $(window).off('hashchange');
        $(document).off('click', 'a[href^="#/"]');
    }
}

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPARouter;
}
