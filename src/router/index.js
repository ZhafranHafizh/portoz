import { createRouter, createWebHistory } from 'vue-router'

// --- KITA HAPUS SEMUA IMPORT STATIS DI SINI ---
// Tidak ada lagi import Home, About, dll. di sini

const routes = [
  {
    path: '/',
    name: 'Home',
    // GANTI DENGAN FUNGSI IMPORT()
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    // GANTI DENGAN FUNGSI IMPORT()
    component: () => import('../views/About.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    // GANTI DENGAN FUNGSI IMPORT()
    component: () => import('../views/Projects.vue')
  },
  {
    path: '/gallery',
    name: 'Gallery',
    // GANTI DENGAN FUNGSI IMPORT()
    component: () => import('../views/Gallery.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    // GANTI DENGAN FUNGSI IMPORT()
    component: () => import('../views/Contact.vue')
  }
  // Analytics route disabled (sudah benar)
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // (Kode scroll behavior Anda sudah bagus, tidak perlu diubah)
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router