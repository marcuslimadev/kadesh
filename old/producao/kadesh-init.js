/**
 * Script de inicialização da aplicação Kadesh
 * Este script aplica as configurações definidas no config.js
 * e intercepta TODOS os tipos de navegação e redirecionamento.
 */

// Intercepta todas as requisições e navegação
(function() {
    'use strict';
    
    // Aguarda a configuração estar disponível
    function waitForConfig(callback) {
        if (typeof window.KADESH_CONFIG !== 'undefined') {
            callback();
        } else {
            setTimeout(() => waitForConfig(callback), 50);
        }
    }
    
    waitForConfig(function() {
        console.log('🚀 Kadesh Config carregado:', window.KADESH_CONFIG.API_BASE_URL);
        
        // Intercepta o fetch global para aplicar a baseURL
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            // Se a URL começar com /api, substitui pela baseURL configurada
            if (typeof url === 'string' && url.startsWith('/api')) {
                url = window.KADESH_CONFIG.API_BASE_URL + url.substring(4);
                console.log('🔄 Fetch URL corrigida para:', url);
            }
            return originalFetch.call(this, url, options);
        };
        
        // Intercepta XMLHttpRequest para axios
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            // Se a URL começar com /api, substitui pela baseURL configurada
            if (typeof url === 'string' && url.startsWith('/api')) {
                url = window.KADESH_CONFIG.API_BASE_URL + url.substring(4);
                console.log('🔄 XHR URL corrigida para:', url);
            }
            return originalXHROpen.call(this, method, url, ...args);
        };
        
        // Intercepta window.location para corrigir redirecionamentos
        const originalLocationAssign = window.location.assign;
        window.location.assign = function(url) {
            if (typeof url === 'string' && url.includes('/kadesh/')) {
                url = url.replace(/\/kadesh\//g, '/');
                console.log('🔄 Redirecionamento corrigido para:', url);
            }
            return originalLocationAssign.call(this, url);
        };
        
        // Intercepta history.pushState e replaceState
        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
            if (typeof url === 'string' && url.includes('/kadesh/')) {
                url = url.replace(/\/kadesh\//g, '/');
                console.log('🔄 PushState URL corrigida para:', url);
            }
            return originalPushState.call(this, state, title, url);
        };
        
        const originalReplaceState = history.replaceState;
        history.replaceState = function(state, title, url) {
            if (typeof url === 'string' && url.includes('/kadesh/')) {
                url = url.replace(/\/kadesh\//g, '/');
                console.log('🔄 ReplaceState URL corrigida para:', url);
            }
            return originalReplaceState.call(this, state, title, url);
        };
        
        // Intercepta cliques em links para corrigir navegação
        document.addEventListener('click', function(event) {
            const link = event.target.closest('a');
            if (link && link.href && link.href.includes('/kadesh/')) {
                event.preventDefault();
                const newHref = link.href.replace(/\/kadesh\//g, '/');
                console.log('🔄 Link corrigido de:', link.href, 'para:', newHref);
                window.location.href = newHref;
            }
        }, true);
        
        // Corrige URL atual se necessário
        if (window.location.pathname.includes('/kadesh/')) {
            const newPath = window.location.pathname.replace(/\/kadesh\//g, '/');
            console.log('🔄 Corrigindo URL atual para:', newPath);
            history.replaceState(null, '', newPath + window.location.search + window.location.hash);
        }
        
        console.log('✅ Interceptadores de rede e navegação instalados com sucesso!');
    });
})();

// Função utilitária para debug
window.debugKadeshRequests = function() {
    console.log('🔍 Configuração atual:', window.KADESH_CONFIG);
    console.log('🌐 BaseURL da API:', window.KADESH_CONFIG.API_BASE_URL);
    console.log('📍 URL atual:', window.location.href);
};