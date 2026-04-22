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
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/one-page',
    name: 'OnePage',
    component: () => import('../views/OnePageView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/ErrorPage.vue'),
    props: () => ({
      errorCode: '404',
      customMessage: ''
    })
  }
  // Analytics route disabled (sudah benar)
]

import { analytics } from '@/services/analytics'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Analytics tracking
router.afterEach((to) => {
  // Ignore admin paths for public analytics
  if (!to.path.startsWith('/admin')) {
    analytics.trackPageView(to.path);
  }
})

export default router