import { createApp } from 'vue';
import App from './App.vue';
import api from './services/api';
import router from './router';

// Importar Design System e Tailwind
import './design-system.css';
import './styles.css';

const app = createApp(App);
app.config.globalProperties.$api = api;
app.use(router);
app.mount('#app');
