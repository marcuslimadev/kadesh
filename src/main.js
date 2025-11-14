import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'

// Import toast CSS
import 'vue-toastification/dist/index.css'

// Create app
const app = createApp(App)

// Install Pinia
app.use(createPinia())

// Install Router
app.use(router)

// Install Toast with custom options
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 5,
  newestOnTop: true,
  toastClassName: 'custom-toast',
  bodyClassName: 'custom-toast-body'
})

// Mount app
app.mount('#app')