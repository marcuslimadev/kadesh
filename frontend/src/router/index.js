import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Projects from '../views/Projects.vue';
import ProjectCreate from '../views/ProjectCreate.vue';
import ProjectShow from '../views/ProjectShow.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/projects', component: Projects },
  { path: '/projects/create', component: ProjectCreate },
  { path: '/projects/:id', component: ProjectShow },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory('/kadesh/'),
  routes,
});

export default router;
