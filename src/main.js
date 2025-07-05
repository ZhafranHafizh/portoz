import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Particles from "particles.vue3"
import './composables/useDarkMode' // Initialize dark mode
import './assets/dark-mode.css' // Dark mode styles

createApp(App)
  .use(router)
  .use(Particles)
  .mount('#app')