import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';
import api from './services/api';
import router from './router';

const app = createApp(App);
app.config.globalProperties.$api = api;
app.use(router);
app.mount('#app');
