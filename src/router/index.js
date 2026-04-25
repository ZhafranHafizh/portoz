import { createRouter, createWebHistory } from 'vue-router'
import { useViewMode } from '@/composables/useViewMode'

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

// View mode router sync
router.beforeEach((to, from, next) => {
  const { setMode, MODE_ONE_PAGE } = useViewMode()
  
  // Force one page mode globally
  setMode(MODE_ONE_PAGE)
  
  // Redirect old tab paths to one-page equivalents
  if (!to.path.startsWith('/admin') && to.path !== '/one-page') {
    if (to.path === '/about') {
      next('/one-page#section-about')
    } else if (to.path === '/projects') {
      next('/one-page#section-projects')
    } else if (to.path === '/gallery') {
      next('/one-page#section-gallery')
    } else if (to.path === '/contact') {
      next('/one-page#section-contact')
    } else if (to.path === '/') {
      next('/one-page')
    } else {
      next()
    }
  } else {
    next()
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