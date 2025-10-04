import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Projects from '../views/Projects.vue'
import Gallery from '../views/Gallery.vue'
import Contact from '../views/Contact.vue'
// import Analytics from '../views/Analytics.vue'  // Disabled Analytics page

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  }
  // Analytics route disabled
  // {
  //   path: '/analytics',
  //   name: 'Analytics',
  //   component: Analytics
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when navigating to a new page
    // This ensures users start at the top of each page
    if (savedPosition) {
      // If user used back/forward button, restore saved position
      return savedPosition
    } else {
      // For all other navigation, scroll to top
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router