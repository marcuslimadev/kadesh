import { createApp } from 'vue';
import App from './App.vue';
import api from './services/api';
import router from './router';

// Importar Tailwind CSS
import './styles.css';

const app = createApp(App);
app.config.globalProperties.$api = api;
app.use(router);
app.mount('#app');
