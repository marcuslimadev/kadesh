import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Projects from '../views/Projects.vue';
import ProjectCreate from '../views/ProjectCreate.vue';
import ProjectShow from '../views/ProjectShow.vue';

function isAuthenticated() {
  return !!localStorage.getItem('token');
}

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login, meta: { guest: true } },
  { path: '/register', component: Register, meta: { guest: true } },
  { path: '/projects', component: Projects },
  { path: '/projects/create', component: ProjectCreate, meta: { auth: true } },
  { path: '/projects/:id', component: ProjectShow },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.auth && !isAuthenticated()) {
    return next('/login');
  }
  if (to.meta.guest && isAuthenticated()) {
    return next('/projects');
  }
  next();
});

export default router;
