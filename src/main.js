import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import i18n from './i18n' // Nonaktifkan i18n sementara
import Particles from "particles.vue3"
import './composables/useDarkMode' // Initialize dark mode
import './assets/dark-mode.css' // Dark mode styles
import { setupViewTracking } from './plugins/viewTracking' // View counter

// Setup view tracking
setupViewTracking(router)

createApp(App)
  .use(router)
  // .use(i18n) // Nonaktifkan i18n sementara
  .use(Particles)
  .mount('#app')