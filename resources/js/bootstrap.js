import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Define o token CSRF nos headers se existir meta no DOM
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
	window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

// Garante envio de cookies em chamadas (útil se API/Subdomínio for diferente)
window.axios.defaults.withCredentials = true;
// Padrões do Axios para CSRF via cookie
window.axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
window.axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Garante que o cookie XSRF-TOKEN exista (útil em produção)
function getCookie(name) {
	const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
	return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie() {
	try {
		if (!getCookie('XSRF-TOKEN')) {
			await window.axios.get('/sanctum/csrf-cookie', { withCredentials: true });
		}
	} catch (_) {
		// silenciosamente ignora – fallback será o header X-CSRF-TOKEN
	}
}

ensureCsrfCookie();

// Base URL automática (útil quando frontend está hospedado em subdomínio separado)
// window.axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
