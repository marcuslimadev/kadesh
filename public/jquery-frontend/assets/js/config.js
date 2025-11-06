/**
 * Configuração Global do Kadesh
 */

console.log('📋 Carregando config.js...');

// URL da API
const API_URL = '/kadesh/api';
const BASE_URL = '/kadesh';
const UPLOAD_URL = '/kadesh/storage/uploads';

// Configurar jQuery AJAX quando estiver disponível
if (typeof jQuery !== 'undefined') {
    console.log('✅ jQuery disponível, configurando AJAX...');
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
} else {
    console.log('⚠️ jQuery ainda não disponível no config.js');
}

console.log('✅ Config carregado. API_URL:', API_URL);
