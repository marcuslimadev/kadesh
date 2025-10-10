import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Define o token CSRF nos headers se existir meta no DOM
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
	window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Base URL automática (útil quando frontend está hospedado em subdomínio separado)
// window.axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
