import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Particles from "particles.vue3"; // <-- PASTIKAN INI ADA

createApp(App)
  .use(router)
  .use(Particles) // <-- DAN PASTIKAN INI ADA
  .mount('#app')