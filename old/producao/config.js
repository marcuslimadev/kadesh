/**
 * Configuração da aplicação Kadesh
 * Este arquivo define as configurações essenciais para o funcionamento
 * correto da aplicação em diferentes ambientes.
 */

// Configuração da aplicação
window.KADESH_CONFIG = {
    // URL base da API - ajuste conforme o ambiente
    API_BASE_URL: '/api',
    
    // Outras configurações que podem ser úteis
    APP_BASE_PATH: '',
    APP_NAME: 'Kadesh Soluções',
    VERSION: '1.0.0',
    
    // Configurações de ambiente
    ENVIRONMENT: 'production',
    DEBUG: false,
    
    // URLs importantes
    URLS: {
        HOME: '/',
        LOGIN: '/login',
        DASHBOARD: '/dashboard',
        AUCTIONS: '/auctions'
    },
    
    // Configurações de sessão
    SESSION: {
        REMEMBER_DAYS: 7,
        STORAGE_KEY: 'kadesh_user',
        EXPIRY_KEY: 'kadesh_auth_expiry'
    }
};

// Para desenvolvimento local, você pode sobrescrever as configurações:
// window.KADESH_CONFIG.API_BASE_URL = '/api';
// window.KADESH_CONFIG.APP_BASE_PATH = '';

console.log('🔧 Kadesh Config loaded:', window.KADESH_CONFIG.ENVIRONMENT);